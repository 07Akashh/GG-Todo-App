import { createTodoApi, CreateTodoRequest, deleteTodoApi, fetchTodosForCalendar, fetchTodosPaged, TodosListResponse, updateTodoApi, UpdateTodoRequest } from '@/services/todoService';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseTodosParams {
  accessToken: string | null;
  page: number;
  searchQuery?: string;
  limit?: number;
  userId?:string;
  enabled?: boolean;
}

export function useTodos({ accessToken, page, searchQuery = '', limit = 10, userId, enabled = true }: UseTodosParams) {
  return useQuery<TodosListResponse, Error>({
    queryKey: ['todos', page, searchQuery, userId],
    queryFn: () => {
      if (!accessToken) throw new Error('No access token');
      return fetchTodosPaged({ accessToken, page, limit, searchQuery, userId });
    },
    enabled: enabled && !!accessToken,
    placeholderData: keepPreviousData,
    staleTime: 30000, // Data is fresh for 30 seconds (stale-while-revalidate)
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Use cached data if available
    refetchOnReconnect: true, // Only refetch on reconnect
  });
}

export function useCreateTodo({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => {
      if (!accessToken) throw new Error('No access token');
      return createTodoApi({ accessToken, data });
    },
    onSuccess: () => {
      // Invalidate all todo queries to refetch, but only active ones
      queryClient.invalidateQueries({ 
        queryKey: ['todos'],
        refetchType: 'active', // Only refetch active queries
      });
      // Also invalidate calendar query
      queryClient.invalidateQueries({ 
        queryKey: ['todos', 'calendar'],
        refetchType: 'active',
      });
    },
    onError: (error: Error) => {
      console.error('Create todo error:', error);
    },
  });
}

export function useUpdateTodo({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: UpdateTodoRequest }) => {
      if (!accessToken) throw new Error('No access token');
      return updateTodoApi({ accessToken, todoId, data });
    },
    onSuccess: () => {
      // Invalidate all todo queries to ensure consistency, but only active ones
      queryClient.invalidateQueries({ 
        queryKey: ['todos'],
        refetchType: 'active', // Only refetch active queries
      });
      // Also invalidate calendar query
      queryClient.invalidateQueries({ 
        queryKey: ['todos', 'calendar'],
        refetchType: 'active',
      });
    },
    onError: (error: Error) => {
      console.error('Update todo error:', error);
    },
  });
}

export function useDeleteTodo({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todoId: string) => {
      if (!accessToken) throw new Error('No access token');
      return deleteTodoApi({ accessToken, todoId });
    },
    onSuccess: () => {
      // Invalidate all todo queries to ensure consistency, but only active ones
      queryClient.invalidateQueries({ 
        queryKey: ['todos'],
        refetchType: 'active', // Only refetch active queries
      });
      // Also invalidate calendar query
      queryClient.invalidateQueries({ 
        queryKey: ['todos', 'calendar'],
        refetchType: 'active',
      });
    },
    onError: (error: Error) => {
      console.error('Delete todo error:', error);
    },
  });
}

// Hook for fetching todos for calendar
export function useCalendarTodos({
  accessToken,
  enabled = true,
}: {
  accessToken: string | null;
  enabled?: boolean;
}) {
  return useQuery<TodosListResponse, Error>({
    queryKey: ['todos', 'calendar'],
    queryFn: () => {
      if (!accessToken) throw new Error('No access token');
      return fetchTodosForCalendar({ accessToken });
    },
    enabled: enabled && !!accessToken,
    staleTime: 30000, // Data is fresh for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

