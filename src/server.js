const express = require('express');
const dbRoutes = require('./routes/dbRoutes.js');
const { initDatabase } = require('./database/database.js')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', dbRoutes);


(async () => await initDatabase())

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
})
