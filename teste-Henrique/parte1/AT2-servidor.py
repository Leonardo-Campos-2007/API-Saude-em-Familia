from flask import Flask, jsonify

app = Flask(__name__)

USUARIOS = [
    {"id": 1, "nome": "Henrique"},
    {"id": 2, "nome": "Joao"},
]


@app.route("/")
def home():
    return """
    <!doctype html>
    <html lang="pt-BR">
        <head>
            <meta charset="utf-8">
            <title>Teste de Software</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #1f2937;
                    background: #f8fafc;
                }

                main {
                    max-width: 720px;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 24px;
                }

                a {
                    display: inline-block;
                    margin-top: 16px;
                    padding: 10px 14px;
                    border-radius: 6px;
                    color: #ffffff;
                    background: #2563eb;
                    text-decoration: none;
                }

                .status {
                    font-weight: 700;
                    color: #047857;
                }
            </style>
        </head>
        <body>
            <main>
                <h1 id="titulo">Servidor de Teste</h1>
                <p id="status" class="status">Servidor funcionando!</p>
                <a id="linkUsuarios" href="/usuarios-web">Ver usuarios cadastrados</a>
            </main>
        </body>
    </html>
    """


@app.route("/usuarios")
def usuarios():
    return jsonify(USUARIOS)


@app.route("/usuarios-web")
def usuarios_web():
    itens = "".join(
        f'<li class="usuario" data-id="{usuario["id"]}">{usuario["nome"]}</li>'
        for usuario in USUARIOS
    )

    return f"""
    <!doctype html>
    <html lang="pt-BR">
        <head>
            <meta charset="utf-8">
            <title>Usuarios</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #1f2937;
                    background: #f8fafc;
                }}

                main {{
                    max-width: 720px;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 24px;
                }}

                li {{
                    padding: 8px 0;
                }}
            </style>
        </head>
        <body>
            <main>
                <h1 id="tituloUsuarios">Usuarios cadastrados</h1>
                <ul id="listaUsuarios">{itens}</ul>
                <p id="totalUsuarios">Total de usuarios: {len(USUARIOS)}</p>
            </main>
        </body>
    </html>
    """


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, use_reloader=False)
