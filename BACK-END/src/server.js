// BACK-END/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//ROUTERS
const authRouter = require('./Controller/authRouter');
const clienteRouter = require('./Controller/clienteRouter');
const produtoRouter = require('./Controller/produtoRouter');
const carrinhoRouter = require('./Controller/carrinhoRouter');
const pedidoRouter = require('./Controller/pedidoRouter');
const enderecoRouter = require('./Controller/enderecoRouter');
const cartaoRouter = require('./Controller/CartaoRouter');
const clubMarketRouter = require('./Controller/ClubMarketRouter');
const pagamentoRouter = require('./Controller/pagamentoRouter');
const entregaRouter = require('./Controller/entregaRouter');


// REGISTRAR ROTAS
app.use('/api', authRouter);
app.use('/api', clienteRouter);
app.use('/api', produtoRouter);
app.use('/api', carrinhoRouter);
app.use('/api', pedidoRouter);
app.use('/api', enderecoRouter);
app.use('/api', cartaoRouter);
app.use('/api', clubMarketRouter);
app.use('/api', pagamentoRouter);
app.use('/api', entregaRouter);



// ROTA RAIZ (Health Check)
app.get('/', (req, res) => {
    res.json({
        message: 'API Subscrivery funcionando!',
        version: '1.0.0',
        status: 'online'
    });
});


// ROTA 404 
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// TRATAMENTO DE ERROS GLOBAL
app.use((err, req, res, next) => {
    console.error('Erro interno:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 Servidor Subscrivery rodando!   ║
║   📍 Porta: ${PORT}                      ║
║   🌐 URL: http://localhost:${PORT}      ║
║   📅 ${new Date().toLocaleString('pt-BR')}  ║
╚═══════════════════════════════════════╝
  `);
});


module.exports = app;