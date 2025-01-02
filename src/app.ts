import express from 'express';
import cors from 'cors';
import path from 'path';
import boletoController from './controllers/boleto.controller';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/boleto', boletoController);

// Root route - serve test page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
