const express = require("express");
const path = require("path");

const usersRoutes = require("./routes/user");

const app = express();

app.use(express.json());

app.use(express.static(
    path.resolve(__dirname, "../public")
));

app.use(usersRoutes);

app.use("/api", medicamentoRoutes);

module.exports = app;