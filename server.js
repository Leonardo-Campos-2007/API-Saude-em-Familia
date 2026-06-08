const express = require('express');
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

const db = require('./db');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const userRoutes = require('./src/routes/api.js'); // ajuste o caminho se necessário
app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server funfionando em http://localhost:${port}`);
})

