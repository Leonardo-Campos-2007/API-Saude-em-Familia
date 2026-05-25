const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    try {

        const response = await fetch(
            "http://localhost:3000/auth/register",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    senha
                })

            }
        );

        const data = await response.json();

        document.getElementById("message")
            .innerHTML = data.message;

    } catch (error) {

        console.error(error);

    }

});