document.getElementById("registerForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const message = document.getElementById("message");

    try {

        const response = await fetch("/cadastrar", {
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

        message.textContent = data.message;

        if (response.ok) {

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Erro ao conectar ao servidor.";

    }

});