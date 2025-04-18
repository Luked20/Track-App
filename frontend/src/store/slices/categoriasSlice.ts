import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Categoria {
  id: number;
  nome: string;
}

interface CategoriasState {
  items: Categoria[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriasState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategorias = createAsyncThunk(
  'categorias/fetchCategorias',
  async () => {
    const response = await axios.get('http://localhost:3000/api/categorias');
    return response.data;
  }
);

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar categorias';
      });
  },
});

export default categoriasSlice.reducer; 