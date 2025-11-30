import { AUTH_HEADERS } from '@/config/api';
import api from './api';

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority?: number; // 1-4
  labels?: string[];
  dueDate: string; // ISO date string
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  dueDate?: string; // ISO date string
  status?: number; // 1-4
  priority?: number; // 1-4
  labels?: string[];
}

export interface Todo {
  _id: string;
  userId: string;
  title: string;
  description: string;
  priority?: number;
  labels?: string[];
  dueDate: string;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodosListResponse {
  total: number;
  todos: Todo[];
}

export interface TodoResponse {
  status: number;
  res?: Todo | TodosListResponse;
  err?: {
    errCode: number;
    msg: string;
  };
}

// Pure API functions for TanStack Query
export async function fetchTodosPaged({
  accessToken,
  page = 0,
  limit = 10,
  searchQuery = '',
  userId
}: {
  accessToken: string;
  page?: number;
  limit?: number;
  searchQuery?: string;
  userId?:string;
}): Promise<TodosListResponse> {
  try {
    const params: any = {
      page,
      limit,
      userId
    };

    if (searchQuery && searchQuery.trim()) {
      params.title = searchQuery.trim();
    }

    const response = await api.get<TodoResponse>('/todo', {
      params,
      headers: {
        accessToken: accessToken,
        Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
      },
    });

    if (response.data.status === 200 && response.data.res) {
      // Handle TodosListResponse format
      if (typeof response.data.res === 'object' && 'todos' in response.data.res && 'total' in response.data.res) {
        return response.data.res as TodosListResponse;
      }
      // Fallback for single todo or array
      const todos = Array.isArray(response.data.res) ? response.data.res : [response.data.res];
      return {
        total: todos.length,
        todos,
      };
    }

    if (response.data.err) {
      throw new Error(response.data.err.msg || 'Failed to fetch todos');
    }

    throw new Error('Failed to fetch todos');
  } catch (error: any) {
    if (error.response?.data) {
      const errData = error.response.data;
      if (errData.err) {
        throw new Error(errData.err.msg || 'Failed to fetch todos');
      }
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}

// Fetch todos for calendar view
export async function fetchTodosForCalendar({
  accessToken,
}: {
  accessToken: string;
}): Promise<TodosListResponse> {
  try {
    const response = await api.get<TodoResponse>('/todo/calendar', {
      headers: {
        accessToken: accessToken,
        Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
      },
    });

    if (response.data.status === 200 && response.data.res) {
      // Handle TodosListResponse format
      if (typeof response.data.res === 'object' && 'todos' in response.data.res && 'total' in response.data.res) {
        return response.data.res as TodosListResponse;
      }
      // Fallback for single todo or array
      const todos = Array.isArray(response.data.res) ? response.data.res : [response.data.res];
      return {
        total: todos.length,
        todos,
      };
    }

    if (response.data.err) {
      throw new Error(response.data.err.msg || 'Failed to fetch calendar todos');
    }

    throw new Error('Failed to fetch calendar todos');
  } catch (error: any) {
    if (error.response?.data) {
      const errData = error.response.data;
      if (errData.err) {
        throw new Error(errData.err.msg || 'Failed to fetch calendar todos');
      }
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export async function createTodoApi({
  accessToken,
  data,
}: {
  accessToken: string;
  data: CreateTodoRequest;
}): Promise<Todo> {
  try {
    const response = await api.post<TodoResponse>('/todo', data, {
      headers: {
        accessToken: accessToken,
        Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
      },
    });

    if (response.data.status === 200 && response.data.res) {
      const todo = Array.isArray(response.data.res) ? response.data.res[0] : response.data.res;
      return todo as Todo;
    }

    if (response.data.err) {
      throw new Error(response.data.err.msg || 'Failed to create todo');
    }

    throw new Error('Failed to create todo');
  } catch (error: any) {
    if (error.response?.data) {
      const errData = error.response.data;
      if (errData.err) {
        throw new Error(errData.err.msg || 'Failed to create todo');
      }
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export async function updateTodoApi({
  accessToken,
  todoId,
  data,
}: {
  accessToken: string;
  todoId: string;
  data: UpdateTodoRequest;
}): Promise<Todo> {
  try {
    const response = await api.put<TodoResponse>(`/todo/${todoId}`, data, {
      headers: {
        accessToken: accessToken,
        Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
      },
    });

    if (response.data.status === 200 && response.data.res) {
      const todo = Array.isArray(response.data.res) ? response.data.res[0] : response.data.res;
      return todo as Todo;
    }

    if (response.data.err) {
      throw new Error(response.data.err.msg || 'Failed to update todo');
    }

    throw new Error('Failed to update todo');
  } catch (error: any) {
    if (error.response?.data) {
      const errData = error.response.data;
      if (errData.err) {
        throw new Error(errData.err.msg || 'Failed to update todo');
      }
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export async function deleteTodoApi({
  accessToken,
  todoId,
}: {
  accessToken: string;
  todoId: string;
}): Promise<void> {
  try {
    const response = await api.delete<TodoResponse>(`/todo/${todoId}`, {
      headers: {
        accessToken: accessToken,
        Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
      },
    });

    if (response.data.status !== 200 && response.data.err) {
      throw new Error(response.data.err.msg || 'Failed to delete todo');
    }
  } catch (error: any) {
    if (error.response?.data) {
      const errData = error.response.data;
      if (errData.err) {
        throw new Error(errData.err.msg || 'Failed to delete todo');
      }
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}