const API_URL = "https://civic-reporting-app-wsz2.onrender.com";

// ================================
// REGISTER
// ================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            alert("Please complete all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        const submitBtn =
            registerForm.querySelector("button[type='submit']");

        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account...";

        try {

            const response = await fetch(
                `${API_URL}/api/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Registration failed"
                );
            }

            alert("✅ Registration successful!");

            registerForm.reset();

            window.location.href = "login.html";

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            alert("❌ " + error.message);

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Register";
        }

    });

}


// ================================
// LOGIN
// ================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        if (!email || !password) {

            alert("Please enter your email and password.");

            return;
        }

        const submitBtn =
            loginForm.querySelector("button[type='submit']");

        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        try {

            const response = await fetch(
                `${API_URL}/api/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error || "Login failed"
                );
            }

            // Save login information
            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("✅ Login successful!");

            // Go to dashboard
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert("❌ " + error.message);

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
        }

    });

}