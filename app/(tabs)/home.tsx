import { GroupedTaskList } from '@/components/screens/home/GroupedTaskList';
import { HomeHeader } from '@/components/screens/home/HomeHeader';
import { SearchBar } from '@/components/screens/home/SearchBar';
import { Task } from '@/components/screens/home/TaskItem';
import { ThemedView } from '@/components/themed-view';
import { useSheet } from '@/contexts/SheetContext';
import { useAppSelector } from '@/hooks/redux';
import { useDeleteTodo, useTodos, useUpdateTodo } from '@/hooks/useTodos';
import { Todo } from '@/services/todoService';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const { openAddTask, openEditTask } = useSheet();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [accumulatedTodos, setAccumulatedTodos] = useState<Todo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set()); // Track loaded pages
  const loadMoreThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRefreshingRef = useRef(false);

  // TanStack Query hooks - only fetch current page
  const { data, isLoading, isFetching, refetch, isRefetching } = useTodos({
    accessToken,
    page,
    searchQuery: debouncedSearchQuery,
    enabled: !!accessToken && !isRefreshingRef.current,
    userId: user?._id
  });

  // Handle page 0 data (reset accumulated todos)
  useEffect(() => {
    if (page === 0 && data?.todos && !loadedPages.has(0)) {
      // Always update when we have data for page 0
      setAccumulatedTodos(data.todos);
      setTotalCount(data.total || 0);
      setLoadedPages(new Set([0]));
    } else if (page === 0 && data?.todos && loadedPages.has(0)) {
      // Update existing page 0 data (refresh scenario)
      setAccumulatedTodos(data.todos);
      setTotalCount(data.total || 0);
    }
  }, [data, page, loadedPages]);

  // Accumulate todos across pages (for pages > 0)
  useEffect(() => {
    if (page > 0 && data?.todos && !loadedPages.has(page)) {
      // Append new todos, avoiding duplicates
      setAccumulatedTodos((prev) => {
        const existingIds = new Set(prev.map((t) => t._id));
        const newTodos = data.todos.filter((t: Todo) => !existingIds.has(t._id));
        return [...prev, ...newTodos];
      });
      setLoadedPages((prev) => new Set([...prev, page]));
    }
  }, [data, page, loadedPages]);

  // Reset accumulated todos when search changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setAccumulatedTodos([]);
      setPage(0);
      setLoadedPages(new Set());
    }
  }, [debouncedSearchQuery, searchQuery]);

  const updateTodoMutation = useUpdateTodo({
    accessToken,
  });

  const deleteTodoMutation = useDeleteTodo({
    accessToken,
  });

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0); // Reset to first page on search
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Map Todo to Task format for display
  const tasks = useMemo(() => {
    if (accumulatedTodos.length === 0) return [];
    
    return accumulatedTodos.map((todo: Todo) => {
      // Priority mapping: 1=low, 2=medium, 3=high, 4=critical
      let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (todo.priority) {
        if (todo.priority === 1) priority = 'low';
        else if (todo.priority === 2) priority = 'medium';
        else if (todo.priority === 3) priority = 'high';
        else if (todo.priority === 4) priority = 'critical';
      }
      
      return {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.status === 3, // Status 3 = Completed
        priority,
        dueDate: todo.dueDate,
        status: todo.status || 1, // Default to 1 (Pending) if not set
        labels: todo.labels || [],
      };
    });
  }, [accumulatedTodos]);

  // Load more todos with throttling
  const loadMore = useCallback(() => {
    // Throttle: only allow load more every 500ms
    if (loadMoreThrottleRef.current) {
      return;
    }

    const hasMore = accumulatedTodos.length < totalCount;
    const nextPage = page + 1;
    
    // Prevent duplicate calls for same page
    if (hasMore && !isFetching && !isLoading && !loadedPages.has(nextPage)) {
      setPage(nextPage);
      
      // Set throttle
      loadMoreThrottleRef.current = setTimeout(() => {
        loadMoreThrottleRef.current = null;
      }, 500);
    }
  }, [accumulatedTodos.length, totalCount, isFetching, isLoading, page, loadedPages]);

  // Cleanup throttle on unmount
  useEffect(() => {
    return () => {
      if (loadMoreThrottleRef.current) {
        clearTimeout(loadMoreThrottleRef.current);
      }
    };
  }, []);

  // Pull to refresh - use TanStack Query's refetch properly
  const handleRefresh = useCallback(async () => {
    isRefreshingRef.current = true;
    
    // Reset to page 0 and clear loaded pages
    setPage(0);
    setLoadedPages(new Set());
    
    // Invalidate all todo queries to mark them as stale
    queryClient.invalidateQueries({ 
      queryKey: ['todos'],
      refetchType: 'active', // Only refetch active queries
    });
    
    // Refetch page 0 using TanStack Query's refetch
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refetch, queryClient]);

  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        // Status cycle: Pending (1) -> In Progress (2) -> Completed (3)
        // If cancelled (4), cycle back to Pending (1)
        let newStatus: number;
        if (task.status === 1) {
          // Pending -> In Progress
          newStatus = 2;
        } else if (task.status === 2) {
          // In Progress -> Completed
          newStatus = 3;
        } else if (task.status === 3) {
          // Completed -> Back to Pending
          newStatus = 1;
        } else {
          // Cancelled (4) -> Back to Pending
          newStatus = 1;
        }
        
        try {
          await updateTodoMutation.mutateAsync({
            todoId: id,
            data: { status: newStatus },
          });
        } catch (error: any) {
          console.error('Toggle task error:', error);
        }
      }
    },
    [tasks, updateTodoMutation]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteTodoMutation.mutateAsync(id);
      } catch (error: any) {
        console.error('Delete task error:', error);
      }
    },
    [deleteTodoMutation]
  );

  const handleTaskPress = useCallback(
    (task: Task) => {
      // Find the full todo data
      const todo = accumulatedTodos.find((t) => t._id === task.id);
      if (todo) {
        openEditTask(todo._id, todo);
      }
    },
    [accumulatedTodos, openEditTask]
  );

  const remainingTasks = tasks.filter((t) => t.status !== 3 && t.status !== 4).length;
  const totalTasks = totalCount;
  // Show tasks if we have accumulated todos OR if we're loading/refreshing (to prevent empty state flash)
  const hasTasks = accumulatedTodos.length > 0 || isLoading || isRefetching;

  return (
    <ThemedView style={styles.container}>
      <HomeHeader
        totalTasks={totalTasks}
        remainingTasks={remainingTasks}
        onAddTask={openAddTask}
      />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <GroupedTaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={handleDeleteTask}
        onTaskPress={handleTaskPress}
        isLoading={isLoading && accumulatedTodos.length === 0}
        isLoadingMore={isFetching && page > 0}
        isRefreshing={isRefetching}
        showEmptyState={!hasTasks && !isRefetching}
        onAddTask={openAddTask}
        onEndReached={loadMore}
        onRefresh={handleRefresh}
        hasMore={accumulatedTodos.length < totalCount}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
});
