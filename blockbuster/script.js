(function(){
    "use strict";
    console.log("reading js");

    // Video play variables.
    const videoContainers = document.querySelectorAll("article");

    videoContainers.forEach(container => {
        let video = container.querySelector("video");
        let playButton = container.querySelector("button")

        playButton.addEventListener("click", function(){
           video.play(); 
           playButton.classList.add("hidden")
           volumeVideos();
        });

        video.addEventListener("ended", function(){
            let nextVidID = parseInt(video.id[video.id.length -1])+1;
            let nextContainer = document.querySelector(`#panel-${nextVidID}`);
            if(nextContainer) {
                let nextVideo = nextContainer.querySelector("video");
                let nextButton = nextContainer.querySelector("button");
                nextVideo.classList.remove("grayed");
                nextButton.classList.remove("hidden");
            }
            
            muteVideos();
        });
    });

    // Reset to beginning.
    const resetButton = document.querySelector(".reset");

    resetButton.addEventListener("click", function(){
        videoContainers.forEach(container => {
            let video = container.querySelector("video");
            let playButton = container.querySelector("button");
            if(container.id == "panel-1") {
                video.classList.remove("grayed");
                playButton.classList.remove("hidden");
            } else {
                video.classList.add("grayed");
                playButton.classList.add("hidden");
            }
        })
    });

    // Volume controls.
    const videos = document.querySelectorAll("video");
    const muteVolume = document.querySelector(".fa-volume-xmark");
    const fullVolume = document.querySelector(".fa-volume-high");

    muteVolume.addEventListener("click", volumeVideos);

    fullVolume.addEventListener("click", muteVideos);

    function muteVideos(){
        fullVolume.classList.add("icon-hidden");
        muteVolume.classList.remove("icon-hidden");

        for(let video of videos) {
            video.muted = true;
        }
    }

    function volumeVideos(){
        fullVolume.classList.remove("icon-hidden");
        muteVolume.classList.add("icon-hidden");

        for(let video of videos) {
            video.muted = false;
        }
    }
})()