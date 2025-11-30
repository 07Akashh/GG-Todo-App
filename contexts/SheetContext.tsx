import { Todo } from '@/services/todoService';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type SheetType = 'add-task' | 'edit-task' | null;

interface SheetContextType {
  sheetType: SheetType;
  editTaskId: string | null;
  editTaskData: Todo | null;
  openAddTask: () => void;
  openEditTask: (taskId: string, taskData?: Todo) => void;
  closeSheet: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskData, setEditTaskData] = useState<Todo | null>(null);

  const openAddTask = useCallback(() => {
    setSheetType('add-task');
    setEditTaskId(null);
    setEditTaskData(null);
  }, []);

  const openEditTask = useCallback((taskId: string, taskData?: Todo) => {
    setSheetType('edit-task');
    setEditTaskId(taskId);
    setEditTaskData(taskData || null);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetType(null);
    setEditTaskId(null);
    setEditTaskData(null);
  }, []);

  return (
    <SheetContext.Provider
      value={{
        sheetType,
        editTaskId,
        editTaskData,
        openAddTask,
        openEditTask,
        closeSheet,
      }}>
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
}

