const passwordInput = document.querySelector('input[name="password"]');
const confirmInput = document.querySelector('input[name="confirm_password"]');
const errorpara = document.getElementById('error_message');
const form = document.getElementById('formid');
const submitbtn = document.getElementById('submitbtn');

function checkPasswordMatch() {

    if (confirmInput.value === '') {
        errorpara.innerHTML = '';
        submitbtn.style.display = 'block' ;
        return;
    }

    if (passwordInput.value !== confirmInput.value) {
        errorpara.innerHTML = `Password not match !`;
        submitbtn.style.display = 'none' ;
    } else {
        errorpara.innerHTML = '';
        submitbtn.style.display = 'block' ;
    }
}

passwordInput.addEventListener('input', checkPasswordMatch);
confirmInput.addEventListener('input', checkPasswordMatch);


const usernameInput = document.querySelector('input[name="email"]'); 
const statusMessage = document.getElementById('emailmessage'); 

usernameInput.addEventListener('input', async () => {
    const username = usernameInput.value.trim();
    if (username === '') {
        statusMessage.innerHTML = '';
        submitbtn.style.display = 'block' ;
        return;
    }

    try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (data.isAvailable) {
            statusMessage.innerHTML = "";
            submitbtn.style.display = 'block' ;
        } else {
            statusMessage.innerHTML = "This email is already taken!";
            submitbtn.style.display = 'none' ;
        }
    } catch (error) {
        console.error("Error checking username:", error);
        statusMessage.innerHTML = "Failed to load .";
        submitbtn.style.display = 'block' ;
    }
});


form.addEventListener('submit', function (event) {
    if (statusMessage.innerHTML === "This email is already taken!") {
        event.preventDefault();
        statusMessage.innerHTML = `PLease change the email !`;
    }
    if (passwordInput.value !== confirmInput.value) {
        event.preventDefault();
        errorpara.innerHTML = `Please match the Password !`;
    }
});