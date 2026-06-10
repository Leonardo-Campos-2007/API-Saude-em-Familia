from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# ==========================================
# ROTA PRINCIPAL
# ==========================================

@app.route('/')
def home():
    return jsonify({
        "mensagem": "Servidor funcionando com sucesso!"
    })


# ==========================================
# API DE CADASTRO
# ==========================================

@app.route('/cadastro', methods=['POST'])
def cadastro():

    dados = request.get_json()

    email = dados.get('email')
    senha = dados.get('senha')
    data_nascimento = dados.get('dataNascimento')

    # VALIDAÇÃO DE EMAIL
    if '@' not in email:
        return jsonify({
            "status": "erro",
            "mensagem": "Email inválido"
        }), 400

    # VALIDAÇÃO DE SENHA
    if senha == "11111111":
        return jsonify({
            "status": "erro",
            "mensagem": "Senha inválida"
        }), 400

    # VALIDAÇÃO DE DATA
    try:
        nascimento = datetime.strptime(
            data_nascimento,
            '%Y-%m-%d'
        )

    except:
        return jsonify({
            "status": "erro",
            "mensagem": "Data de nascimento inválida"
        }), 400

    # VALIDAÇÃO DE IDADE
    idade = datetime.now().year - nascimento.year

    if idade < 18:
        return jsonify({
            "status": "erro",
            "mensagem": "Idade insuficiente"
        }), 400

    return jsonify({
        "status": "sucesso",
        "mensagem": "Registrado com sucesso"
    }), 201


# ==========================================
# API DE LOGIN
# ==========================================

@app.route('/login', methods=['POST'])
def login():

    dados = request.get_json()

    email = dados.get('email')
    senha = dados.get('senha')

    # EMAIL INVÁLIDO
    if email != "admin@email.com":

        return jsonify({
            "status": "erro",
            "mensagem": "Usuário não encontrado"
        }), 404

    # SENHA INCORRETA
    if senha != "123456":

        return jsonify({
            "status": "erro",
            "mensagem": "Senha incorreta"
        }), 401

    return jsonify({
        "status": "sucesso",
        "mensagem": "Login realizado com sucesso"
    }), 200


# ==========================================
# EXECUÇÃO DO SERVIDOR
# ==========================================

if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )