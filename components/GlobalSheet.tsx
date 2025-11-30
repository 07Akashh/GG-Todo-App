import { AddTaskSheet } from '@/components/screens/add-task/AddTaskSheet';
import { EditTaskSheet } from '@/components/screens/edit-task/EditTaskSheet';
import { useSheet } from '@/contexts/SheetContext';
import React from 'react';

export function GlobalSheet() {
  const { sheetType, editTaskId, closeSheet } = useSheet();

  if (sheetType === 'add-task') {
    return <AddTaskSheet visible={true} onClose={closeSheet} />;
  }

  if (sheetType === 'edit-task' && editTaskId) {
    return <EditTaskSheet visible={true} onClose={closeSheet} taskId={editTaskId} />;
  }

  return null;
}

