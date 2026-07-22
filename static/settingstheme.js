const wholebody = document.querySelector('body');
const box = document.querySelector('.container');

// HTML ke data attribute se value nikalna
const currentTheme = wholebody.dataset.theme;

console.log("Current Theme Value from HTML attribute:", currentTheme);

if (currentTheme == '2') { 
    //wholebody.style.backgroundColor = 'rgb(15, 15, 18)';
    //if(box) box.style.backgroundColor = 'rgb(28, 30, 36)';
    //wholebody.style.color = 'rgb(163, 226, 255)';
} else {
    //wholebody.style.backgroundColor = 'rgb(219, 237, 245)';
    //if(box) box.style.backgroundColor = 'rgb(255, 255, 255)';
    //wholebody.style.color = 'rgb(0, 0, 0)';
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
