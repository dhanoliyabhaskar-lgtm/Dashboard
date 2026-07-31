const body = document.querySelector('body');
const box = document.querySelector('.container');
const abc = document.querySelectorAll('.content, header'); 
const darkicon = document.querySelector ('#darkicon')
const lighticon = document.querySelector('#lighticon')


// HTML ke data attribute se value nikalna
const currentTheme = JSON.parse(document.body.dataset.theme);

console.log("Current Theme Value from HTML attribute:", currentTheme);

if (currentTheme == 2) {
    box.style.backgroundColor = 'rgb(40, 40, 57)';
    body.style.backgroundColor = 'rgb(40, 40, 57)';
    abc.forEach( box => {
        box.style.backgroundColor = 'rgb(28, 30, 36)';
        box.style.color = 'white';
    })
    lighticon.style.display = 'block';
    darkicon.style.display = 'none';
   
} else {
    box.style.backgroundColor = 'rgb(255, 255, 255)';
    body.style.backgroundColor = 'rgb(255, 255, 255)';
    abc.forEach( box => {
        box.style.backgroundColor = 'white';
        box.style.color = 'black';
    })
    lighticon.style.display = 'none';
    darkicon.style.display = 'block';

}