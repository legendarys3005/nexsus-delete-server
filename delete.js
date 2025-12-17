const COOLDOWN_DAYS = 90;
const REQUEST_KEY = "deleteRequestTime";

window.onload = checkDeleteStatus

async function sendDeletionRequest() {
    const button = document.getElementById('delete-button');
    try {
        const email = document.getElementById('email-text-box').value.trim();
        const password = document.getElementById('password-text-box').value;

        button.disabled = true;
        button.style.opacity = 0.5;
        button.style.backgroundColor = "#808080";
        button.style.cursor = "not-allowed";

        if (email === "") {
            throw "Email field is empty";
        }
        if (password === "") {
            throw "Password field is empty";
        }

        const response = await fetch('https://nexsus-api.onrender.com/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data.message['message'] || "Something went Wrong";
        }

        showPostDeletationPage();

        console.log("Server response: ", data)
    } catch (e) {
        showSnackbar(e);
        button.disabled = false;
        button.style.opacity = 1;
        button.style.backgroundColor = "#d93f3d";
        button.style.cursor = "pointer";
    }
}
function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.classList.add("show")
    setTimeout(() => {
        snackbar.classList.remove("show");
    }, 3000); // disappears after 3 seconds
}

function showPostDeletationPage() {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('done').style.display = 'flex';
    document.getElementById('land').style.display = 'none';

    localStorage.setItem(REQUEST_KEY, Date.now());
}

function checkDeleteStatus() {
    const storedTime = localStorage.getItem(REQUEST_KEY);

    if (storedTime) {
        const elapsedDays = (Date.now() - parseInt(storedTime)) / (1000 * 60 * 60 * 24);
        if (elapsedDays < COOLDOWN_DAYS) {
            // Still within 90-day cooldown
            document.getElementById('done').style.display = 'flex';
            document.getElementById('land').style.display = 'none';
            console.log(`Days left before next submit: ${Math.trunc(elapsedDays)}`);
            return;
        } else {
            // Cooldown expired, allow form again
            localStorage.removeItem(REQUEST_KEY);
        }
    }

    // Default view (show delete form)
    document.getElementById('land').style.display = "flex";
    document.getElementById('done').style.display = "none";
}


function togglePassword() {
    const passwordInput = document.getElementById('password-text-box');
    const visibilityIcon = document.getElementById('visibility');
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    visibilityIcon.textContent = isPassword ? "visibility" : "visibility_off";
}