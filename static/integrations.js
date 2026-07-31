const wholebody = document.querySelector('.main-content');
const sidebar = document.querySelector('.sidebar')
const sidebarbutton = document.querySelectorAll('.sidebar ul li a')
const activesidebarbutton = document.querySelector('.sidebar ul li.active a')
const blackicon = document.querySelectorAll('.black-sidebar-icon')
const whiteicon = document.querySelectorAll('.white-sidebar-icon')
const box = document.querySelector('.container');
const integrationsheader = document.querySelector('.integrations-header')
const integrationsheaderp = document.querySelector('.integrations-header p')
const integrationscard = document.querySelector('.integrations-card')
const intergrationscardh3 = document.querySelector('.integrations-card h3')

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
    integrationsheader.style.backgroundColor = 'rgb(28, 30, 36)';
    integrationsheader.style.color = 'white';
    integrationsheaderp.style.color = 'rgb(219, 216, 216)';
    integrationscard.style.backgroundColor = 'rgb(28, 30, 36)';
    intergrationscardh3.style.color = 'white';
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
    integrationsheader.style.backgroundColor = 'white';
    integrationsheader.style.color = 'rgb(28, 30, 36)';
    integrationsheaderp.style.color = '#777';
    integrationscard.style.backgroundColor = 'white';
    intergrationscardh3.style.color = '#333';
}






const status = user.status;

const spotifybtn = document.querySelector('#spotifybtn');
const spotifystatus = document.querySelector('#spotifystatus');

if(status.spotify=='yes'){
    spotifybtn.style.zIndex=-1;
    spotifystatus.style.zIndex=1;
}else{
    spotifybtn.style.zIndex=1;
    spotifystatus.style.zIndex=-1;
}


const githubbtn = document.querySelector('#githubbtn');
const githubstatus = document.querySelector('#githubstatus');

if(status.github=='yes'){
    githubbtn.style.zIndex=-1;
    githubstatus.style.zIndex=1;
}else{
    githubbtn.style.zIndex=1;
    githubstatus.style.zIndex=-1;
}


const calenderbtn = document.querySelector('#googlecalendarbtn');
const calenderstatus = document.querySelector('#googlecalendarstatus');

if(status.calender=='yes'){
    calenderbtn.style.zIndex=-1;
    calenderstatus.style.zIndex=1;
}else{
    calenderbtn.style.zIndex=1;
    calenderstatus.style.zIndex=-1;
}


//const leetcodebtn = document.querySelector('#leetcodebtn');
//const leetcodestatus = document.querySelector('#leetcodestatus');
//
//if(status.leetcode=='yes'){
//    leetcodebtn.style.zIndex=-1;
//    leetcodestatus.style.zIndex=1;
//}else{
//    leetcodebtn.style.zIndex=1;
//    leetcodestatus.style.zIndex=-1;
//}


const codeforcesbtn = document.querySelector('#codeforcesbtn');
const codeforcesstatus = document.querySelector('#codeforcesstatus');

if(status.codeforces === 'yes'){
    codeforcesbtn.style.zIndex=-1;
    codeforcesstatus.style.zIndex=1;
}else{
    codeforcesbtn.style.zIndex=1;
    codeforcesstatus.style.zIndex=-1;
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
};