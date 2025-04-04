(function() {
    'use strict';

    // HTML elements.
    const button = document.querySelector('button');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const sections = document.querySelectorAll('section')
    const footer = document.querySelector('footer');
    const fillers = document.querySelectorAll('.filler');

    // Content changes.
    const buttonState = document.querySelector("#button-state");
    const sweetImage = document.querySelector("#sweet-image");
    const spicyImage = document.querySelector("#spicy-image");
    const sweetText = document.querySelector("#sweet");
    const spicyText = document.querySelector("#spicy");

    // Variables.
    let mode = 'sweet';

    // Switch styles.
    button.addEventListener('click', function() {
        if (mode === 'sweet') {
            body.className = 'switch';
            banner.className = 'switch';
            button.className = 'switch';
            footer.className = 'switch';
            sweetImage.className = 'switch';
            spicyImage.className = 'switch';
            sweetText.className = 'switch';
            spicyText.className = 'switch';

            for (const section of sections) {
                section.className = 'switch';
            }

            for (const filler of fillers) {
                filler.classList.add('switch');
            }

            buttonState.innerHTML = "sweet";

            mode = 'spicy';
        } else {
            body.removeAttribute('class');
            banner.removeAttribute('class');
            button.removeAttribute('class');
            footer.removeAttribute('class');
            sweetImage.removeAttribute('class');
            spicyImage.removeAttribute('class');
            sweetText.removeAttribute('class');
            spicyText.removeAttribute('class');

            for (const section of sections) {
                section.removeAttribute('class');
            }

            for (const filler of fillers) {
                filler.classList.remove('switch');
            }

            buttonState.innerHTML = "spicy";
            mode = 'sweet'
        }
    })

    // Fill elements on hover. 
    for (let section of sections) {
        let links = section.querySelectorAll('li a');
        let fillbox = section.querySelector('.filler');
        for (let link of links) {
            link.addEventListener('mouseenter', function(){
                let height = Math.abs(link.getBoundingClientRect().bottom - section.getBoundingClientRect().bottom);
                fillbox.style.height = `${height}px`;
            });

            link.addEventListener('mouseleave', function(){
                fillbox.style.height = "0px";
            });
        }
    }
})()