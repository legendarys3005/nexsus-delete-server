const COOLDOWN_DAYS = 90;
const REQUEST_KEY = "deleteRequestTime";

// window.onload = checkDeleteStatus

async function sendDeletionRequest(){
    try{
        const email = document.getElementById('email-text-box').value.trim();
        const password = document.getElementById('password-text-box').value;

        const response = await fetch('https://nonperfected-erasmo-centauric.ngrok-free.dev/delete-account',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password}),
        });

        showPage();

        const data = await response.json();
        console.log("Server response: ", data)
    }catch(e){
        alert(e);
    }
}

function showPage() {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('done').style.display = 'block';
    document.getElementById('land').style.display = 'none';

    localStorage.setItem(REQUEST_KEY, Date.now());
}

function checkDeleteStatus() {
    const storedTime = localStorage.getItem(REQUEST_KEY);

    if (storedTime) {
        const elapsedDays = (Date.now() - parseInt(storedTime)) / (1000 * 60 * 60 * 24);
        if (elapsedDays < COOLDOWN_DAYS) {
            // Still within 90-day cooldown
            document.getElementById('done').style.display = 'block';
            document.getElementById('land').style.display = 'none';
            return;
        } else {
            // Cooldown expired, allow form again
            localStorage.removeItem(REQUEST_KEY);
        }
    }

    // Default view (show delete form)
    document.getElementById('land').style.display = 'block';
    document.getElementById('done').style.display = 'none';
}


function togglePassword() {
    const passwordInput = document.getElementById('password-text-box');
    const visibilityIcon = document.getElementById('visibility');
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    visibilityIcon.textContent = isPassword ? "visibility" : "visibility_off";
}