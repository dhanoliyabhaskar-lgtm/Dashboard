const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const goalsheader = document.querySelector('.goals-header')
const goalsheaderp = document.querySelector('.goals-header p')
const goaltabs = document.querySelectorAll('.goal-tabs button')
const goalcard = document.querySelectorAll('.goal-card')

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
    goalsheader.style.backgroundColor = 'rgb(28, 30, 36)';
    goalsheader.style.color = 'white';
    goalsheaderp.style.color = 'rgb(219, 216, 216)';
    goaltabs.forEach(tabs => {
        tabs.style.color = 'white';
    });
    goalcard.forEach(card => {
        card.style.backgroundColor = "rgb(28, 30, 36)";
    });
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
    goalsheader.style.backgroundColor = 'white';
    goalsheader.style.color = 'rgb(28, 30, 36)';
    goalsheaderp.style.color = '#777';
    goaltabs.forEach(tabs => {
        tabs.style.color = 'rgb(98, 96, 96)';
    });
    goalcard.forEach(card => {
        card.style.backgroundColor = "white";
    });
}








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