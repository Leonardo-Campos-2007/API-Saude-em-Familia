document.getElementById("registerForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome  = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const message = document.getElementById("message");

    try {

        const response = await fetch("/cadastroUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        message.textContent = data.message || data.error;
        message.style.color = response.ok ? "green" : "red";

        if (response.ok) {
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }

    } catch (error) {

        console.error(error);
        message.textContent = "Erro ao conectar ao servidor.";
        message.style.color = "red";

    }
});