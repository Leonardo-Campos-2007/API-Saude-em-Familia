const express = require("express");
const router = express.Router();
const db = require("../../database");

router.post('/validarLogin', (req, res) => {
    const { email, senha } = req.body;

    db.query(
        'SELECT * FROM usuario WHERE email = ? AND senha = ?',
        [email, senha],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            return res.status(200).json({ message: 'Login realizado com sucesso' });
        }
    );
});

router.post('/cadastroUser', (req, res) => {
    const { nome, email, senha } = req.body;

    db.query(
        'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senha],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            res.status(201).json({
                message: 'Usuario cadastrado com sucesso',
                id: result.insertId,
                nome,
                email
            });
        }
    );
});

router.post('/cadastroMedicamento', (req, res) => {
    const { id_usuario, nome, dosagem, via_administracao, frequencia, horario_principal, data_inicio, data_termino, observacoes } = req.body;

    db.query(
        'INSERT INTO medicamento (id_usuario, nome, dosagem, via_administracao, frequencia, horario_principal, data_inicio, data_termino, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id_usuario, nome, dosagem, via_administracao, frequencia, horario_principal, data_inicio, data_termino, observacoes],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            res.status(201).json({
                message: 'Medicamento cadastrado com sucesso',
                id: result.insertId,
                id_usuario,
                nome,
                dosagem,
                via_administracao,
                frequencia,
                horario_principal,
                data_inicio,
                data_termino,
                observacoes
            });
        }
    );
});

module.exports = router;