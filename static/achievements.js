const cards = document.querySelector(".cards");

const Card1 = cards.querySelector(".card1").outerHTML;
for ( let i=0; i<4; i++ ) {
    cards.insertAdjacentHTML("beforeend", Card1);
}

const Card2 = cards.querySelector(".card2").outerHTML;
for (let i=0; i<2; i++ ) {
    cards.insertAdjacentHTML("beforeend", Card2 );
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