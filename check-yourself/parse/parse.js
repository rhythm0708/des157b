(function(){
    "use strict";
    // Parse the CSV file using PapaParse (https://www.papaparse.com/).
    Papa.parse("parse/games.csv", {
        // Set properties.
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results){
            // Parse needed data.
            const gameData = results.data.map(game => ({
                title: String(game.title),
                id: game.id,
                score: game.metascore,
                userScore: game.user_score
            }));

            // Remove repeat data using Set().
            const seenTitles = new Set();
            const uniqueGameData = gameData.filter(game => {
                if(seenTitles.has(game.title)) {
                    return false;
                } else {
                    seenTitles.add(game.title);
                    return true;
                }
            });

            // Turn into JSON file.
            const json = JSON.stringify(uniqueGameData, null, 4);

            // Turn into Blob to download.
            const blob = new Blob([json], { type: "applicatiom/json"});
            const blobURL = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobURL;
            a.download = "data.json";
            a.click();
        }
    })
})();
