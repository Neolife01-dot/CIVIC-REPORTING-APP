// Authentication//

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){

            alert("Passwords do not match.");

            return;

        }

        alert("Registration successful! Backend connection will be added later.");

    });

}

// Login Form

const loginForm = document.querySelector("form");

if(loginForm && !registerForm){

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        alert("Login successful! Backend connection will be added later.");

    });

}