import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { SelectChangeEvent } from '@mui/material/Select';
import { AppDispatch } from '../store';
import { createHabito } from '../store/habitosSlice';
import dayjs, { Dayjs } from 'dayjs';

interface FormData {
  nome: string;
  frequencia: string;
  dias_semana: string;
  hora_notificacao: string;
  categoria_id: string;
  meta_dias: string;
  dias_consecutivos: number;
  total_dias: number;
}

const NovoHabito: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    frequencia: '',
    dias_semana: '',
    hora_notificacao: '',
    categoria_id: '',
    meta_dias: '',
    dias_consecutivos: 0,
    total_dias: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (newValue: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      hora_notificacao: newValue ? newValue.format('HH:mm') : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createHabito(formData));
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Novo Hábito
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Hábito"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequência</InputLabel>
                  <Select
                    name="frequencia"
                    value={formData.frequencia}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="diaria">Diária</MenuItem>
                    <MenuItem value="semanal">Semanal</MenuItem>
                    <MenuItem value="mensal">Mensal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="1">Saúde</MenuItem>
                    <MenuItem value="2">Estudo</MenuItem>
                    <MenuItem value="3">Trabalho</MenuItem>
                    <MenuItem value="4">Lazer</MenuItem>
                    <MenuItem value="5">Fitness</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Hora da Notificação"
                  value={formData.hora_notificacao ? dayjs(`2000-01-01T${formData.hora_notificacao}`) : null}
                  onChange={handleTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Meta (dias)"
                  name="meta_dias"
                  type="number"
                  value={formData.meta_dias}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Criar Hábito
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NovoHabito; 