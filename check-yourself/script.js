(function(){
    "use strict";
    console.log("reading js");

    // Get JSON data.
    let metaData;
    fetchData();

    // Game variables.
    let score = 0;
    let rounds = 0;
    let currGame;
    let roundPlayed = false;
    let usedGames = [];

    // Log.
    let gameLog = [];

    // DOM elements.
    const playerScore = document.querySelector("#score");
    const playerRounds = document.querySelector("#rounds");
    const targetGame = document.querySelector("#target-game");
    const searchBox = document.querySelector("#search-box");
    const suggestionBox = document.querySelector("#suggestions-box");
    const confirmButton = document.querySelector("#confirm-game");
    const resultsBox = document.querySelector("#results");
    const redDot = document.querySelector("#red-dot");
    const blueDot = document.querySelector("#blue-dot");
    const arrowContainer = document.querySelector(".arrow");
    const arrowDiffSign = document.querySelector("#diff-sign");
    const arrowDiffNum = document.querySelector("#diff-num");
    const commentUserGuess = document.querySelector("#user-guess");
    const commentTargetNum = document.querySelector("#target-num");
    const commentDiff = document.querySelector("#diff");
    const nextButton = document.querySelector("#next-game");
    const logButton = document.querySelector(".fa-scroll");
    const userLog = document.querySelector("#log");
    const logDataBox = document.querySelector("#log-data");

    // Autocomplete filter.
    searchBox.addEventListener("input", function(){
        let normalizedInput = this.value.toLowerCase();

        if(normalizedInput.length != 0){
            // Get top 5 suggestions.
            const filteredSuggestions = filterSuggestions(normalizedInput);

            suggestionBox.innerHTML = "";

            filteredSuggestions.forEach(suggestion => {
                let suggestionItem = document.createElement('div');
                suggestionItem.classList.add("suggestion-item");
                // Bold matching text from input in suggestions.
                suggestionItem.innerHTML = highlightMatch(suggestion.title, normalizedInput);
                suggestionBox.appendChild(suggestionItem);
                // On click, fill in box with game.
                suggestionItem.addEventListener("click", function(){
                    searchBox.value = suggestion.title;
                    suggestionBox.innerHTML = "";
                    checkValidGame(searchBox.value, filteredSuggestions); 
                });
            })
            checkValidGame(searchBox.value, filteredSuggestions);
        }
    }
    );

    // Submit guess.
    confirmButton.addEventListener("click", function(e){
        e.preventDefault();

        if(!roundPlayed && !usedGames.includes(searchBox.value)){
            // Update score.
            let playerGuess = getObjectByTitle(searchBox.value).score;
            let realAns = getObjectByTitle(targetGame.textContent).score;
            let diff = Math.abs(playerGuess - realAns);
            updateScore(diff);

            // Display and move dots.
            displayResults(playerGuess, realAns, diff);

            // Change comment.
            commentUserGuess.textContent = playerGuess;
            commentTargetNum.textContent = realAns;
            commentDiff.textContent = diff;

            // Disallow multiple submits.
            searchBox.readOnly = true;
            confirmButton.classList.add("unselectable");
            roundPlayed = true;

            // Add guess to usedGames list.
            usedGames.push(searchBox.value);
            addToLog(playerGuess, realAns);

        } else if(usedGames.includes(searchBox.value)) {
            alert("sneaky... you can't do that!")
        } else {
            alert("you've already submitted an answer for this round!");
        }
    });

    nextButton.addEventListener("click", function(e){
        e.preventDefault();
        resultsBox.classList.add("invisible");
        searchBox.readOnly = false;
        confirmButton.classList.remove("unselectable");
        searchBox.value = "";
        searchBox.classList.remove("valid");
        roundPlayed = false;
        randomizeGame();
    });

    logButton.addEventListener("click", function(){
        logDataBox.className = (logDataBox.className === "swipe-down") ? "swipe-up" : "swipe-down";
    });

    // FUNCTIONS.
    async function fetchData() {
        try {
            const metaDataPromise = await fetch('data.json');
            metaData = await metaDataPromise.json();
            randomizeGame();
        } catch (error) {
            console.error("Could not get data", error);
        }
    }

    function randomizeGame() {
        let randomNumber = Math.floor(Math.random() * metaData.length);
        currGame = metaData[randomNumber].title;
        targetGame.textContent = currGame;
        usedGames.push(currGame);
    }

    function getObjectByTitle(title){
        return metaData.find(game => game.title == title);
    }

    // SCORE FORMULA HERE.
    function updateScore(diff){
        let thisRoundScore;
        if(diff <= 50){
            thisRoundScore = 50-diff;
        } else {
            thisRoundScore = 0;
        }
        score += (thisRoundScore);
        playerScore.textContent = score;
        playerRounds.textContent = ++rounds;
    }

    function filterSuggestions(input){
        // Get all suggestions.
        const suggestions = metaData.filter(item => item.title.toLowerCase().includes(input))
        // Sort by index position in suggestion using sort(a,b) -> a-b.
        suggestions.sort((a,b) => a.title.toLowerCase().indexOf(input) - b.title.toLowerCase().indexOf(input));
        // Return top 5.
        return suggestions.slice(0,5);
    }

    function highlightMatch(suggestion, input) {
        input = input.toLowerCase();
        let inputIndex = suggestion.toLowerCase().indexOf(input);
        if(inputIndex != -1){
            return `<p>${suggestion.slice(0,inputIndex)}<span class="highlight">${suggestion.slice(inputIndex, inputIndex + input.length)}</span>${suggestion.slice(inputIndex + input.length, suggestion.length)}</p>`;
        } 
        return suggestion;
    }

    function checkValidGame(input, suggestions){
        // Use .some() method to check validity.
        let match = suggestions.some(game => game.title == input);
        // Two ternary expressions **can probably combine.
        match ? searchBox.classList.add("valid") : searchBox.classList.remove("valid");
        match ? confirmButton.style.display = "block" : confirmButton.style.display = "none";
    }

    function displayResults(playerGuess, realAns, diff){
        console.log(playerGuess, realAns, diff);
        resultsBox.classList.remove("invisible");
        redDot.style.left = `${playerGuess}%`;
        redDot.style.transform = `translate(-${playerGuess}%, -50%)`;
        redDot.querySelector("p").textContent = playerGuess;
        blueDot.style.left = `${realAns}%`;
        blueDot.style.transform = `translate(-${realAns}%, -50%)`;
        blueDot.querySelector("p").textContent = realAns;

        // Move arrow.
        arrowContainer.style.width = `calc(${diff}% + 20px)`;
        if(playerGuess > realAns) {
            arrowContainer.querySelector(".arrow-right").classList.add("invisible");
            arrowContainer.querySelector(".arrow-left").classList.remove("invisible");

            arrowContainer.style.right = `${100-playerGuess}%`;
            arrowContainer.style.transform = `translateY(-50%)`;
            arrowDiffSign.textContent = "-";
        } else if(playerGuess < realAns) {
            arrowContainer.querySelector(".arrow-left").classList.add("invisible");
            arrowContainer.querySelector(".arrow-right").classList.remove("invisible");

            arrowContainer.style.right = `${100-realAns}%`;
            arrowContainer.style.transform = `translateY(-50%)`;
            arrowDiffSign.textContent = "+";
        } else {
            arrowContainer.querySelector(".arrow-left").classList.add("invisible");
            arrowContainer.querySelector(".arrow-right").classList.add("invisible");
        }
        arrowDiffNum.textContent = diff;
    }

    function addToLog(playerGuess, realAns){
        gameLog.push({
            guessGame: searchBox.value,
            guessVal: playerGuess,
            targetGame: targetGame.textContent,
            targetVal: realAns,
            diff: arrowDiffSign.textContent + arrowDiffNum.textContent
        });
        updateUILog();
    }

    function updateUILog(){
        userLog.innerHTML = "";
        // Make heading.
        const entry = document.createElement("div");
        entry.className = "log-entry";
        const p1 = document.createElement("p");
        p1.className = "red bold";
        const p2 = document.createElement("p");
        p2.className = "blue bold";
        const p3 = document.createElement("p");
        p3.className = "black bold";

        // Append data.
        p1.textContent = `Your guess`;
        p2.textContent = `Target`;
        p3.textContent = `Difference`;

        // Append to UI log.
        entry.appendChild(p1);
        entry.appendChild(p2);
        entry.appendChild(p3);
        userLog.appendChild(entry);

        let reversedLog = gameLog.reverse();

        for(let part of reversedLog){
            // Make elements.
            const entry = document.createElement("div");
            entry.className = "log-entry";
            const p1 = document.createElement("p");
            p1.className = "red";
            const p2 = document.createElement("p");
            p2.className = "blue";
            const p3 = document.createElement("p");
            p3.className = "black";

            // Append data.
            p1.textContent = `${part.guessGame} (${part.guessVal})`;
            p2.textContent = `${part.targetGame} (${part.targetVal})`;
            p3.textContent = `${part.diff}`;

            // Append to UI log.
            entry.appendChild(p1);
            entry.appendChild(p2);
            entry.appendChild(p3);
            userLog.appendChild(entry);
        }
    }

    function toTitleCase(str){
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
})()