import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Habito {
  id: number;
  nome: string;
  frequencia: string;
  dias_semana?: string;
  hora_notificacao?: string;
  categoria_id: number;
  meta_dias?: number;
  data_criacao: string;
}

interface HabitosState {
  items: Habito[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitosState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchHabitos = createAsyncThunk(
  'habitos/fetchHabitos',
  async () => {
    const response = await axios.get('http://localhost:3000/api/habitos');
    return response.data;
  }
);

export const createHabito = createAsyncThunk(
  'habitos/createHabito',
  async (habito: Omit<Habito, 'id' | 'data_criacao'>) => {
    const response = await axios.post('http://localhost:3000/api/habitos', habito);
    return response.data;
  }
);

export const marcarHabito = createAsyncThunk(
  'habitos/marcarHabito',
  async (habitoId: number) => {
    const response = await axios.post(`http://localhost:3000/api/habitos/${habitoId}/registro`);
    return response.data;
  }
);

const habitosSlice = createSlice({
  name: 'habitos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabitos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHabitos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar hábitos';
      })
      .addCase(createHabito.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(marcarHabito.fulfilled, (state, action) => {
        // Atualizar o estado conforme necessário
      });
  },
});

export default habitosSlice.reducer; 