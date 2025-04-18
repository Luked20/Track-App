# Track App - Sistema de Rastreamento de Hábitos

Aplicativo para ajudar no desenvolvimento e acompanhamento de hábitos diários.

## Requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm ou yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados PostgreSQL:
- Crie um banco de dados chamado 'track'
- Execute o script `init.sql` para criar as tabelas

## Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Endpoints da API

### Categorias
- GET /api/categorias - Lista todas as categorias

### Hábitos
- POST /api/habitos - Cria um novo hábito
- GET /api/habitos - Lista todos os hábitos
- POST /api/habitos/:id/registro - Marca um hábito como feito
- GET /api/habitos/:id/estatisticas - Obtém estatísticas de um hábito

## Estrutura do Banco de Dados

- categorias: Armazena as categorias de hábitos
- habitos: Armazena os hábitos cadastrados
- registros_habitos: Registra o progresso diário dos hábitos
- estatisticas: Mantém estatísticas de cada hábito
