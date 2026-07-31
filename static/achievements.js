const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const achievementsheader = document.querySelector('.achievements-header')
const achievementsheaderp = document.querySelector('.achievements-header p')
const achievementspage = document.querySelector('.achievements-cards')
const cardscont = document.querySelector('.cards')
const card1 = document.querySelectorAll('.card1')
const darkimg = document.querySelectorAll('#darkimg')
const lightimg = document.querySelectorAll('#lightimg')

// HTML ke data attribute se value nikalna

const user = JSON.parse(document.body.dataset.user);

const currentTheme = user.theme;

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
    achievementsheader.style.backgroundColor = 'rgb(28, 30, 36)';
    achievementsheader.style.color = 'white';
    achievementsheaderp.style.color = 'rgb(219, 216, 216)';
    achievementspage.style.backgroundColor = 'rgb(28, 30, 36)';
    cardscont.style.backgroundColor = 'rgb(28, 30, 36)';
    card1.forEach(card => {
        card.style.backgroundColor = 'black';
    });
    darkimg.forEach(img => {
        img.style.display = "block";
    });
    lightimg.forEach(img => {
        img.style.display = "none";
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
    achievementsheader.style.backgroundColor = 'white';
    achievementsheader.style.color = 'rgb(28, 30, 36)';
    achievementsheaderp.style.color = '#777';
    achievementspage.style.backgroundColor = 'white';
    cardscont.style.backgroundColor = 'white';
    card1.forEach(card => {
        card.style.backgroundColor = 'white';
    });
    darkimg.forEach(img => {
        img.style.display = "none";
    });
    lightimg.forEach(img => {
        img.style.display = "block";
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