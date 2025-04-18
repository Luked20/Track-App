import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Estatistica {
  id: number;
  habito_id: number;
  dias_consecutivos: number;
  melhor_sequencia: number;
  total_dias: number;
}

interface EstatisticasState {
  items: Estatistica[];
  loading: boolean;
  error: string | null;
}

const initialState: EstatisticasState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchEstatisticas = createAsyncThunk(
  'estatisticas/fetchEstatisticas',
  async (habitoId: number) => {
    const response = await axios.get(`http://localhost:3000/api/habitos/${habitoId}/estatisticas`);
    return response.data;
  }
);

const estatisticasSlice = createSlice({
  name: 'estatisticas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstatisticas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstatisticas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload];
      })
      .addCase(fetchEstatisticas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar estatísticas';
      });
  },
});

export default estatisticasSlice.reducer; 