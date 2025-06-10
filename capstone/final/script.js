(function(){
    "use strict";
    console.log("reading js");

    // VARIABLES.
    const slides = document.querySelectorAll(".swiper-slide");
    const captions = ["AI is rewriting the rules of job hiring—will it make them fairer, or just more biased?",
         "Predict crimes before they happen. That's the promise of AI policing. But is that what's really happening?", 
         "Would you trade years in prison for minutes in a virtual AI experiment?", 
         "Recycling and waste are growing issues. But AI is providing a light in the dark."];
    let captionText = document.querySelector("#caption p");
    const articleOverlay = document.querySelector("#article-overlay");
    const articles = document.querySelectorAll("article");
    const closeArticle = document.querySelectorAll(".fa-xmark");
    const returnHome = document.querySelectorAll("article button");

    // Audio.
    const bgm = new Audio('audio/ambient-bg-2.mp3');
    const openArticleSfx = new Audio('audio/riser-5.mp3');
    const closeArticleSfx = new Audio('audio/descender-4.mp3');
    const swipeSfx = new Audio('audio/descender-3.mp3');
    bgm.muted = true;
    bgm.loop = true;
    bgm.volume = 0.1;
    bgm.playbackRate = 0.8;
    openArticleSfx.playbackRate = 1.2;
    closeArticleSfx.playbackRate = 0.8;
    openArticleSfx.volume = 0.5;
    closeArticleSfx.volume = 0.2;
    swipeSfx.volume = 0.1;

    document.addEventListener("click", unmuteAudio);
    document.addEventListener("keydown", unmuteAudio);
    document.addEventListener("touchstart", unmuteAudio);
        
    // AOS.
    AOS.init({
        offset: -200
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
        
        // Sfx.
        swipeSfx.pause();
        swipeSfx.currentTime = 0;
        swipeSfx.play();
    });

    // Click slide = transition.
    slides.forEach(slide => slide.addEventListener("click", function(e){
        let articleNo = slide.id.match(/-(\d+)$/);
        articleNo = parseInt(articleNo[1]);
        expandToArticle(articleNo, slide); 

        // Make article visible.
        articles.forEach(article => article.className = "not-displaying");
        articles[articleNo-1].className = "displaying";
        articles[articleNo-1].scrollTop = 0;

        openArticleSfx.play();
    }));

    // Scroll animations.
    articles.forEach(article => article.addEventListener("scroll", function(){
        const elements = article.querySelectorAll('[data-aos]');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
            el.classList.add('aos-init');

            if (inView) {
                el.classList.add('aos-animate');
            } 
            // else {
            //     el.classList.remove('aos-animate');
            // }
        });
    }));

    // Close article.
    closeArticle.forEach(x => x.addEventListener("click", function() {
        closeArticleSfx.play();
        returnToHome();
    }))

    returnHome.forEach(buttton => buttton.addEventListener("click", function() {
        closeArticleSfx.play();
        returnToHome();
    }));

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
                    // { color: '#A681AE', pos: 0 },
                    // { color: '#AA4AA8', pos: .49 },
                    // { color: '#DF35B2', pos: 1 }

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

    function unmuteAudio() {
        bgm.muted = false;
        bgm.play();
        document.removeEventListener("click", unmuteAudio);
        document.removeEventListener("keydown", unmuteAudio);
        document.removeEventListener("touchstart", unmuteAudio);
    }
})();
