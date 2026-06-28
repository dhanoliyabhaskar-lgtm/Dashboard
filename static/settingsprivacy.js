const passwordInput = document.querySelector('input[name="newpassword"]');
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
        errorpara.style.color = "red";
        errorpara.style.fontSize = '75%';
        submitbtn.style.display = 'none' ;
    } else {
        errorpara.innerHTML = '';
        submitbtn.style.display = 'block' ;
    }
}

passwordInput.addEventListener('input', checkPasswordMatch);
confirmInput.addEventListener('input', checkPasswordMatch);