const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "familia"
});

db.connect((err) => {

    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }

    console.log("MySQL conectado");

});

module.exports = db;