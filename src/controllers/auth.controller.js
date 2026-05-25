
const Usuario = require("../models/user.model");

exports.login = async (req, res) => {

    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });

    if(!usuario){

        return res.status(401).json({
            message: "Usuário não encontrado"
        });
    }

    if(usuario.senha !== senha){

        return res.status(401).json({
            message: "Senha inválida"
        });
    }

    return res.json({
        message: "Login realizado"
    });
};