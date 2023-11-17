const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const createTables = require('./config/createDataBase');

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

createTables();

const userRoutes = require('./routes/usersRoutes');
app.use('/users', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Rota não encontrada');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message
  });
});

app.use(helmet())

app.listen(port, () => {
  console.log(`Api está rodando na porta: ${port}`);
});
