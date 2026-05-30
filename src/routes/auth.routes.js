const express = require("express");
const router = express.Router();

const Usuario = require("../models/user.model");

router.post("/validar", async (req, res) => {

    try {

        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({
                message: "Email ou senha incorretos"
            });
        }

        if (usuario.senha !== senha) {
            return res.status(401).json({
                message: "Email ou senha incorretos"
            });
        }

        return res.status(200).json({
            message: "Login realizado com sucesso"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor"
        });

    }

});

router.post("/cadastrar", async (req, res) => {

    try {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                message: "Email e senha são obrigatórios"
            });
        }

        const usuarioExistente =
            await Usuario.findOne({ email });

        if (usuarioExistente) {
            return res.status(409).json({
                message: "Algo deu errado"
            });
        }

        const novoUsuario = new Usuario({
            email,
            senha
        });

        await novoUsuario.save();

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor"
        });

    }

});

module.exports = router;