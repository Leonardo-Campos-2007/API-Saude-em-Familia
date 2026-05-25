const express = require("express");

const path = require("path");

const app = express();

const authRoutes = require("./routes/auth.routes");


app.use(express.json());


// ARQUIVOS ESTÁTICOS
app.use(express.static(path.resolve(__dirname, "../public")));


// ROTAS
app.use("/auth", authRoutes);


// TESTE
app.get("/teste", (req, res) => {

    res.send("FUNCIONANDO");

});


module.exports = app;