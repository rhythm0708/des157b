(function(){
    "use strict";
    console.log("reading js");

    // VARIABLES.
    const slides = document.querySelectorAll(".swiper-slide");
    const captions = ["bla bla bla", "bla bla 2", "bla bla 3", "bla bla 4"];
    let captionText = document.querySelector("#caption p");
    const articleOverlay = document.querySelector("#article-overlay");
    const articles = document.querySelectorAll("article");
    const closeArticle = document.querySelector(".fa-xmark");

    // Alert.
    alert("You are a user who is interested in speculative fiction about AI.\n\n 1. You want to learn more about AI in hiring. Read that article. \n 2. Return to home screen.\n 3. Scroll to another article and enter it");

    // AOS.
    AOS.init({
        offset: 600,
        once: true,
    });

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

        // Make article visible.
        articles.forEach(article => article.className = "not-displaying");
        articles[articleNo-1].className = "displaying";
    }));

    // Scroll animations.
    articles.forEach(article => article.addEventListener("scroll", function(){
        const elements = article.querySelectorAll('[data-aos]');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;

            if (inView) {
                el.classList.add('aos-animate');
            } 
            // else {
            //     el.classList.remove('aos-animate');
            // }
        });
    }));

    // Close article.
    closeArticle.addEventListener("click", function(){
        returnToHome();
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
            AOS.refresh();
        }, 1200);
        
        // Make swiper scrolling inactive.
        swiper.allowTouchMove = false;
    }

    function returnToHome() {
        let activeSlide = document.querySelector(`#minisode-${swiper.realIndex + 1}`);

        activeSlide.classList.remove("expand");
        activeSlide.classList.add("regular-size");

        activeSlide.querySelector("h2").classList.remove("fade-text-hidden");
        articleOverlay.className = "hidden";
        
        // Make swiper scrolling inactive.
        swiper.allowTouchMove = true;
    }
})();
