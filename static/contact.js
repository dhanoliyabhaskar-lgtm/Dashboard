function roggle() {
    let span = document.querySelector('.whatsapp')

    if (span.style.display != 'none') {
        span.style.display = 'none';
    } else {
        span.style.display = 'block';
    }
};

function toggle() {
    let span = document.querySelector('.email')

    if (span.style.display != 'none') {
        span.style.display = 'none';
    } else {
        span.style.display = 'block';
    }
};