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
const profilepage = document.querySelector('.profile-page')
const infobox = document.querySelectorAll('.personal-info div p')

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
    profilepage.style.backgroundColor = 'rgb(28, 30, 36)';
    infobox.forEach(box => {
        box.style.backgroundColor = "white";
        box.style.color = "rgb(28, 30, 36)";
    })
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
    profilepage.style.backgroundColor = 'white';
    infobox.forEach(box => {
        box.style.backgroundColor = "white";
        box.style.color = "rgb(28, 30, 36)";
    })
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