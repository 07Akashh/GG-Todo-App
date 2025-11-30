import { CreateTodoRequest, Todo, todoService, UpdateTodoRequest } from '@/services/todoService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  total: number;
  hasMore: boolean;
  searchQuery: string;
  isFetching: boolean; // Prevent duplicate requests
}

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  error: null,
  currentPage: 0,
  total: 0,
  hasMore: true,
  searchQuery: '',
  isFetching: false,
};

export const fetchTodos = createAsyncThunk(
  'todo/fetchTodos',
  async (
    { page = 0, searchQuery = '', isRefresh = false }: { page?: number; searchQuery?: string; isRefresh?: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token available');
      }

      const response = await todoService.getAllTodos(accessToken, page, 10, searchQuery);

      if (response.status === 200 && response.res) {
        // Check if response.res is TodosListResponse format
        if (typeof response.res === 'object' && 'todos' in response.res && 'total' in response.res) {
          return {
            todos: response.res.todos,
            total: response.res.total,
            page,
            searchQuery,
          };
        }
        // Fallback for single todo or array format
        const todos = Array.isArray(response.res) ? response.res : [response.res];
        return {
          todos,
          total: todos.length,
          page,
          searchQuery,
        };
      }

      if (response.err) {
        return rejectWithValue(response.err.msg || 'Failed to fetch todos');
      }

      return rejectWithValue('Failed to fetch todos. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const createTodo = createAsyncThunk(
  'todo/createTodo',
  async (data: CreateTodoRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token available');
      }

      const response = await todoService.createTodo(accessToken, data);

      if (response.status === 200 && response.res) {
        const todo = Array.isArray(response.res) ? response.res[0] : response.res;
        return todo;
      }

      if (response.err) {
        return rejectWithValue(response.err.msg || 'Failed to create todo');
      }

      return rejectWithValue('Failed to create todo. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todo/updateTodo',
  async (
    { todoId, data }: { todoId: string; data: UpdateTodoRequest },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token available');
      }

      const response = await todoService.updateTodo(accessToken, todoId, data);

      if (response.status === 200 && response.res) {
        const todo = Array.isArray(response.res) ? response.res[0] : response.res;
        return todo;
      }

      if (response.err) {
        return rejectWithValue(response.err.msg || 'Failed to update todo');
      }

      return rejectWithValue('Failed to update todo. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todo/deleteTodo',
  async (todoId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token available');
      }

      const response = await todoService.deleteTodo(accessToken, todoId);

      if (response.status === 200) {
        return todoId;
      }

      if (response.err) {
        return rejectWithValue(response.err.msg || 'Failed to delete todo');
      }

      return rejectWithValue('Failed to delete todo. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTodos: (state) => {
      state.todos = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.total = 0;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // Fetch todos
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        const { page = 0, searchQuery = '', isRefresh = false } = action.meta.arg || {};
        const isNewSearch = searchQuery !== state.searchQuery;
        const isFirstPage = page === 0;

        // Prevent duplicate requests
        if (state.isFetching) {
          return;
        }
        state.isFetching = true;

        if (isRefresh) {
          state.isRefreshing = true;
        } else if (isFirstPage || isNewSearch) {
          state.isLoading = true;
          state.todos = [];
        } else {
          state.isLoadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const { todos, total, page, searchQuery } = action.payload;
        const isNewSearch = searchQuery !== state.searchQuery;
        const isFirstPage = page === 0;

        state.isLoading = false;
        state.isLoadingMore = false;
        state.isRefreshing = false;
        state.isFetching = false;
        state.error = null;
        state.currentPage = page;
        state.total = total;
        state.searchQuery = searchQuery;

        if (isFirstPage || isNewSearch) {
          state.todos = todos;
        } else {
          // Append new todos, avoiding duplicates
          const existingIds = new Set(state.todos.map((t) => t._id));
          const newTodos = todos.filter((t) => !existingIds.has(t._id));
          state.todos = [...state.todos, ...newTodos];
        }

        state.hasMore = state.todos.length < total;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.isRefreshing = false;
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // Create todo
    builder
      .addCase(createTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.push(action.payload);
        state.error = null;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update todo
    builder
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete todo
    builder
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetTodos } = todoSlice.actions;
export default todoSlice.reducer;

