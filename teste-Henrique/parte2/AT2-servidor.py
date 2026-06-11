from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return """
    <!doctype html>
    <html lang="pt-BR">
        <head>
            <meta charset="utf-8">
            <title>Login de Usuario</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    color: #1f2937;
                    background: #edf2f7;
                }

                main {
                    max-width: 460px;
                    margin: 56px auto;
                    background: #ffffff;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 24px;
                }

                label {
                    display: block;
                    margin-top: 14px;
                    font-weight: 700;
                }

                input {
                    box-sizing: border-box;
                    width: 100%;
                    margin-top: 6px;
                    padding: 10px;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    font-size: 16px;
                }

                button {
                    width: 100%;
                    margin-top: 20px;
                    padding: 12px 14px;
                    border: 0;
                    border-radius: 6px;
                    color: #ffffff;
                    background: #2563eb;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 700;
                }

                .mensagem {
                    margin-top: 16px;
                    padding: 12px;
                    border-radius: 6px;
                    font-weight: 700;
                }

                .sucesso {
                    background: #dcfce7;
                    color: #047857;
                }

                .erro {
                    background: #fee2e2;
                    color: #b91c1c;
                }
            </style>
        </head>
        <body>
            <main>
                <h1 id="titulo">Login de usuario</h1>
                <form id="formLogin">
                    <label for="email">Email</label>
                    <input id="email" name="email" type="text">

                    <label for="senha">Senha</label>
                    <input id="senha" name="senha" type="password">

                    <button id="btnEntrar" type="submit">Entrar</button>
                </form>
                <p id="mensagem" class="mensagem" hidden></p>
            </main>

            <script>
                const form = document.getElementById("formLogin");
                const mensagem = document.getElementById("mensagem");

                form.addEventListener("submit", function (event) {
                    event.preventDefault();

                    const email = document.getElementById("email").value.trim();
                    const senha = document.getElementById("senha").value.trim();

                    mensagem.hidden = false;
                    mensagem.className = "mensagem";

                    if (!email || !senha) {
                        mensagem.textContent = "Email e senha obrigatorios";
                        mensagem.classList.add("erro");
                        return;
                    }

                    if (!email.includes("@")) {
                        mensagem.textContent = "Email invalido";
                        mensagem.classList.add("erro");
                        return;
                    }

                    if (email !== "admin@email.com") {
                        mensagem.textContent = "Usuario nao encontrado";
                        mensagem.classList.add("erro");
                        return;
                    }

                    if (senha !== "123456") {
                        mensagem.textContent = "Senha incorreta";
                        mensagem.classList.add("erro");
                        return;
                    }

                    mensagem.textContent = "Login realizado com sucesso";
                    mensagem.classList.add("sucesso");
                    form.reset();
                });
            </script>
        </body>
    </html>
    """


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081, debug=True, use_reloader=False)
