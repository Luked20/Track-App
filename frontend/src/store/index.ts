import { configureStore } from '@reduxjs/toolkit';
import habitosReducer from './habitosSlice';
import categoriasReducer from './slices/categoriasSlice';
import estatisticasReducer from './slices/estatisticasSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    habitos: habitosReducer,
    categorias: categoriasReducer,
    estatisticas: estatisticasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Exportar um hook personalizado para usar o dispatch tipado
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 