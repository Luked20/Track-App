import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { fetchHabitos } from '../store/habitosSlice';
import { Habito } from '../types/habito';

const Estatisticas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: habitos, loading, error } = useSelector((state: RootState) => state.habitos as { items: Habito[], loading: boolean, error: string | null });

  useEffect(() => {
    dispatch(fetchHabitos());
  }, [dispatch]);

  const calcularMediaDiasConsecutivos = (): number => {
    if (habitos.length === 0) return 0;
    const total = habitos.reduce((sum: number, habito: Habito) => sum + habito.dias_consecutivos, 0);
    return Math.round(total / habitos.length);
  };

  const calcularTaxaSucesso = (): number => {
    if (habitos.length === 0) return 0;
    const habitosComMeta = habitos.filter((habito: Habito) => habito.meta_dias);
    if (habitosComMeta.length === 0) return 0;
    
    const sucessos = habitosComMeta.filter((habito: Habito) => 
      habito.dias_consecutivos >= parseInt(habito.meta_dias)
    ).length;
    
    return Math.round((sucessos / habitosComMeta.length) * 100);
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erro ao carregar estatísticas: {error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Estatísticas
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Média de Dias Consecutivos
              </Typography>
              <Typography variant="h3" color="primary">
                {calcularMediaDiasConsecutivos()} dias
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Taxa de Sucesso
              </Typography>
              <Typography variant="h3" color="primary">
                {calcularTaxaSucesso()}%
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={calcularTaxaSucesso()}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {habitos.map((habito: Habito) => (
          <Grid item xs={12} sm={6} md={4} key={habito.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {habito.nome}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Dias Consecutivos: {habito.dias_consecutivos}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Total de Dias: {habito.total_dias}
                </Typography>
                {habito.meta_dias && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Progresso para meta ({habito.meta_dias} dias)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((habito.dias_consecutivos / parseInt(habito.meta_dias)) * 100, 100)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Estatisticas; 