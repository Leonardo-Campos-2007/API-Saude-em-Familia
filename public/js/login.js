const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const senha = document.getElementById("password").value;

    try {

        const response = await fetch("http://localhost:3000/auth/login", {

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

        console.log(data);

        document.getElementById("message").innerHTML =
            data.message;

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerHTML =
            "Erro ao conectar com servidor";

    }

    
});