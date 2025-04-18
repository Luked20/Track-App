import React, { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
            }}
          >
            TrackApp
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ mr: 2 }}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/estatisticas"
            variant={location.pathname === '/estatisticas' ? 'outlined' : 'text'}
          >
            Estatísticas
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} TrackApp - Todos os direitos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 