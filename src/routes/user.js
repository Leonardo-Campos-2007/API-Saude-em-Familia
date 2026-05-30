const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/validar", (req, res) => {

    const { email, senha } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ? AND senha = ?",
        [email, senha],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Email ou senha incorretos"
                });
            }

            return res.status(200).json({
                message: "Login realizado com sucesso"
            });
        }
    );
});

module.exports = router;