const status = JSON.parse(document.body.dataset.status);

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


const leetcodebtn = document.querySelector('#leetcodebtn');
const leetcodestatus = document.querySelector('#leetcodestatus');

if(status.leetcode=='yes'){
    leetcodebtn.style.zIndex=-1;
    leetcodestatus.style.zIndex=1;
}else{
    leetcodebtn.style.zIndex=1;
    leetcodestatus.style.zIndex=-1;
}


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