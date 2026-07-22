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



function roggle() {
    let sidebar = document.querySelector('.sidebar');
    let logo = document.querySelector('.sidebar .logo');

    if (sidebar.style.display != 'none') {
        sidebar.style.display = 'none';
    } else {
        sidebar.style.display = 'block';
        sidebar.style.width = '70vw';
        sidebar.style.position = 'fixed';
        sidebar.style.zIndex = '11';
        sidebar.style.height = '100vh';
        logo.style.visibility = 'hidden';
    }
};

function moggle() {
    if (window.innerWidth <= 1400) {
        let sidebars = document.querySelector('.sidebar');
        if (sidebars.style.display != 'none') {
            sidebars.style.display = 'none';
        }
    }
}
