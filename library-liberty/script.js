export let invertY = false;
export let volumeValue = 50;

console.log("reading js");

// Settings overlay.
const settingsPanel = document.querySelector("#settings-overlay");
const closeSettings = settingsPanel.querySelector(".fa-xmark");
const openSettings = document.querySelector(".fa-gear");

closeSettings.addEventListener("click", function(){
    settingsPanel.className = "hidden";
});
openSettings.addEventListener("click", function(){
    settingsPanel.className = "visible";
});

// Update volume slider.
const volSlider = document.querySelector("#volume");
const volValue = document.querySelector("#vol-value");
volSlider.addEventListener("input", function(){
    const value = (volSlider.value - volSlider.min) / (volSlider.max - volSlider.min) * 100;
    volSlider.style.backgroundImage = `linear-gradient(to right, #ff69b4 0%, #ff69b4 ${value}%, #eee ${value}%, #eee 100%)`;
    volValue.innerHTML = Math.round(value);
    volumeValue = value;
})

// Update invert-Y axis.
const invertYOption = document.querySelector("#invertY");
invertYOption.addEventListener("change", function(e) {
    invertY = e.target.checked;
})