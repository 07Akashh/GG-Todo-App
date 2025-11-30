import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTodos } from '@/store/slices/todoSlice';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTodos({ page: 1, searchQuery: '' }));
    }
  }, [dispatch, isAuthenticated]);

  return <Redirect href="/(tabs)/home" />;
}

