document.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch("/validar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        });

        const data = await response.json();

        if (response.ok) {

            console.log("Login OK");

            message.textContent = data.message;

            window.location.href = "/calendario.html";

        } else {

            message.textContent = data.message;

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Erro ao conectar ao servidor";

    }

});