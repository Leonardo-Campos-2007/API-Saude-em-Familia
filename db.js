const mysql = require('mysql2');

//parametros de configuração do banco (credenciais)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', //catolica
    database: 'familia2', //nome do banco de dados
    port: '3306' //3307
});

//estabelecer a conexão
db.connect(err =>{
    if(err) throw err;
    console.log('conectado ao banco de dados');
});

//exportar o módulo de conexão
module.exports = db;