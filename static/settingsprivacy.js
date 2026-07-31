const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const settingsbar = document.querySelector('.settings-bar')
const settingsheader = document.querySelector('.settings-header')
const settingsheaderp = document.querySelector('.settings-header p')
const privacyandsecuritypage = document.querySelector('.privacyandsecurity-page')

// HTML ke data attribute se value nikalna
const currentTheme = JSON.parse(document.body.dataset.theme);

console.log("Current Theme Value from HTML attribute:", currentTheme);

if (currentTheme == 2) {
    wholebody.style.backgroundColor = 'rgb(40, 40, 57)';
    box.style.backgroundColor = 'rgb(28, 30, 36)';
    wholebody.style.color = 'white';
    sidebar.style.backgroundColor = 'rgb(40, 40, 57)';
    sidebarbutton.forEach(button => {
        button.style.backgroundColor = "rgb(28, 30, 36)";
        button.style.color = "white";
    });
    whiteicon.forEach(icon => {
        icon.style.display = "block";
    });
    blackicon.forEach(icon => {
        icon.style.display = "none";
    });
    activesidebarbutton.style.backgroundColor = '#3a4ccd';
    activesidebarbutton.style.color = 'white';
    settingsbar.style.backgroundColor = 'rgb(40, 40, 57)';
    settingsheader.style.backgroundColor = 'rgb(28, 30, 36)';
    settingsheader.style.color = 'white';
    settingsheaderp.style.color = 'rgb(219, 216, 216)';
    privacyandsecuritypage.style.backgroundColor = 'rgb(28, 30, 36)';
} else {
    wholebody.style.backgroundColor = 'rgb(219, 237, 245)';
    box.style.backgroundColor = 'rgb(255, 255, 255)';
    wholebody.style.color = 'rgb(0, 0, 0)';
    sidebar.style.backgroundColor = 'white';
    sidebarbutton.forEach(button => {
        button.style.backgroundColor = "white";
        button.style.color = "rgb(28, 30, 36)";
    });
    whiteicon.forEach(icon => {
        icon.style.display = "none";
    });
    blackicon.forEach(icon => {
        icon.style.display = "block";
    });
    activesidebarbutton.style.backgroundColor = '#3a4ccd';
    activesidebarbutton.style.color = 'white';
    settingsbar.style.backgroundColor = 'rgb(219, 237, 245)';
    settingsheader.style.backgroundColor = 'white';
    settingsheader.style.color = 'rgb(28, 30, 36)';
    settingsheaderp.style.color = '#777';
    privacyandsecuritypage.style.backgroundColor = 'white';
}





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