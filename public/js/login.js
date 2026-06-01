document.getElementById("loginForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        const message = document.getElementById("message");

        try {

            const response = await fetch("/validarLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            message.textContent = data.message || data.error;
            message.style.color = response.ok ? "green" : "red";

            if (response.ok) {
                localStorage.setItem('sf_user', JSON.stringify({
                    id_usuario: data.id_usuario,
                    name: data.nome,
                    email: data.email
                }));

                setTimeout(() => {
                    window.location.href = "/calendario.html";
                }, 1500);
            }

        } catch (error) {

            console.error(error);
            message.textContent = "Erro ao conectar ao servidor";
            message.style.color = "red";

        }

    });