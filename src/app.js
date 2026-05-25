const express = require("express");

const path = require("path");

const app = express();

const authRoutes = require("./routes/auth.routes");


app.use(express.json());


// SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, "../public")));


app.use("/auth", authRoutes);




module.exports = app;
