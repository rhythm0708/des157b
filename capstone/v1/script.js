(function(){
    "use strict";
    console.log("reading js");

    // VARIABLES.
    const slides = document.querySelectorAll(".swiper-slide");
    const captions = ["bla bla bla", "bla bla 2", "bla bla 3", "bla bla 4"];
    let captionText = document.querySelector("#caption p");
    const articleOverlay = document.querySelector("#article-overlay");
    const closeArticle = document.querySelector(".fa-xmark");

    // SWIPER.
    const swiper = new Swiper('.swiper', {

    loop: true,
    slidesPerView: 1.1,
    centeredSlides: true,
    spaceBetween: 30,
    speed: 500,

    navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
    },
    });

    swiper.on('slideChange', function () {
        console.log(swiper.activeIndex);

        // Set opacity. 
        let activeSlide = document.querySelector(`#minisode-${swiper.realIndex + 1}`);

        slides.forEach(slide => {
            slide.classList.remove("active");
            slide.classList.add("inactive");
        });

        activeSlide.classList.remove("inactive");
        activeSlide.classList.add("active"); 

        // Set caption fade-in-out.
        captionText.className = "fade-text-hidden";
        setTimeout(() => {
            captionText.textContent = captions[`${swiper.realIndex}`];
            captionText.className = "fade-in";
        }, 250);
        
    });

    // Click slide = transition.
    slides.forEach(slide => slide.addEventListener("click", function(e){
        let articleNo = slide.id.match(/-(\d+)$/);
        articleNo = parseInt(articleNo[1]);
        expandToArticle(articleNo, slide); 
    }));

    // Close article.
    closeArticle.addEventListener("click", function(){

    });

    // GRANIM.
    var granimInstance = new Granim({
    element: '#background',
    direction: 'radial',
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                [
                    // Edit this one.
                    { color: '#8737B2', pos: 0 },
                    { color: '#BA4399', pos: .62 },
                    { color: '#DA6199', pos: 1 }
                ], [
                    { color: '#DA6199', pos: 0 },
                    { color: '#BA4399', pos: .38 },
                    { color: '#8737B2', pos: 1 }
                ],
            ]}
            }
        });

    // FUNCTION: Article transition
    function expandToArticle(articleNo, slide) {
        // Expand animation + text fade
        slide.classList.add("expand");
        slide.querySelector("h2").classList.add("fade-text-hidden");

        // Article fades in.
        setTimeout(() => {
            articleOverlay.className = "visible";
        }, 1200);
        
        // Make swiper scrolling inactive.
        swiper.allowTouchMove = false;
    }
})();
