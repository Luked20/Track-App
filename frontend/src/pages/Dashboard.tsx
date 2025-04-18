import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Button, Box, LinearProgress, Chip } from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { fetchHabitos, marcarHabito } from '../store/habitosSlice';
import { useNavigate } from 'react-router-dom';
import { Habito } from '../types/habito';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: habitos, loading, error } = useSelector((state: RootState) => state.habitos);

  useEffect(() => {
    dispatch(fetchHabitos());
  }, [dispatch]);

  const handleMarcarHabito = async (habitoId: number) => {
    await dispatch(marcarHabito(habitoId));
    dispatch(fetchHabitos());
  };

  const calcularProgresso = (habito: Habito) => {
    if (!habito.meta_dias) return 0;
    return Math.min((habito.dias_consecutivos / parseInt(habito.meta_dias)) * 100, 100);
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erro ao carregar hábitos: {error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Meus Hábitos</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/novo-habito')}
        >
          + Novo Hábito
        </Button>
      </Box>

      <Grid container spacing={3}>
        {habitos.map((habito: Habito) => (
          <Grid item xs={12} sm={6} md={4} key={habito.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {habito.nome}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Frequência: {habito.frequencia}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Dias Consecutivos: {habito.dias_consecutivos}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Total de Dias: {habito.total_dias}
                  </Typography>
                </Box>

                {habito.meta_dias && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Progresso para meta ({habito.meta_dias} dias)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calcularProgresso(habito)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2" color="textSecondary" align="right">
                      {habito.dias_consecutivos}/{habito.meta_dias} dias
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMarcarHabito(habito.id)}
                    sx={{ mt: 2 }}
                  >
                    Marcar como Feito
                  </Button>
                  <Chip
                    label={habito.frequencia}
                    color="secondary"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {habitos.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Você ainda não tem hábitos cadastrados
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  Clique no botão "Novo Hábito" para começar a criar seus hábitos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard; 