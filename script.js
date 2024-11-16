import allWordsList from './words.js';

document.addEventListener("DOMContentLoaded", () => {
    // initializating global constants
    const rows = document.querySelectorAll(".inputRows");
    const helpBtn = document.getElementById("helpBtn");
    const aboutBtn = document.getElementById("aboutBtn");
    const helpPopup = document.getElementById("helpPopup");
    const aboutPopup = document.getElementById("aboutPopup");
    const overlay = document.getElementById("overlay");
    const closeHelpBtn = document.getElementById("closeHelpBtn");
    const closeAboutBtn = document.getElementById("closeAboutBtn");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const tryAgainBtn = document.getElementById("tryAgainBtn");
    const shareBtn = document.getElementById("shareGame");
    const shareBtnLost = document.getElementById("shareGameLost");


    let isListeningKeys = true; // flag to control key listening

    let currentRow = 0;
    let currentField = 0;
    var word = (allWordsList[Math.floor(Math.random() * allWordsList.length)]).toUpperCase();
    const keyCaps = document.querySelectorAll(".keyCaps");

    // creating an on-click event listener for every keycap div
    keyCaps.forEach(keyCap => {
        keyCap.addEventListener('click', (event) => {
            handleKeyPress(keyCap.id);
        });
    });

    // event listener for key press
    document.addEventListener("keydown", (event) => {

        if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            return; // skip if it's a key combination
        }
        if (!isListeningKeys) return; //
        const key = event.key;
        handleKeyPress(key)
    });

    // function to return the element of a specific keyCap
    function getKeycap(letter) {
        return document.getElementById(letter.toUpperCase());
    }

    // function to handle key presses from both physical typing and virtual keyboard
    function handleKeyPress(key) {

        const fields = rows[currentRow].querySelectorAll(".inputFields");

        if (/^[a-zA-Z]$/.test(key)) {
            // if it is a letter and current field is not full
            if (currentField < fields.length) {
                fields[currentField].textContent = key.toUpperCase(); // proceed to add the letter in the field

                // add animation class to animate the current field
                fields[currentField].classList.add("animate");

                // add a white border around the input box for the sake of aesthetics
                fields[currentField].style.border = "solid 2px white";

                // increment currentField
                currentField++;
            }
        }

        else if (key === "Backspace") {
            // if backspace is pressed, delete the previous field
            if (currentField > 0) {
                fields[currentField - 1].classList.remove("animate"); // remove animation class when backspace is pressed
                // reset white border around the input box after deleting for the sake of aesthetics(again)
                fields[currentField - 1].style.border = "solid rgb(104, 104, 104) 2px";
                currentField--;
                fields[currentField].textContent = "";
            }
        }

        else if (key === "Enter") {
            if (currentField === fields.length) {
                if (markGuess(fields) === 0) {
                    // increment the currentRow and reset currentField to 0
                    currentRow++;
                    currentField = 0;
                }

            }

            else {
                showError("Not enough letters!")
            }
        }
    }

    function markGuess(fields) {
        // making guessed rows letters white colored
        let guessedWord = [];
        let targetWord = word.split("");
        let isMarked = new Array(5).fill(false); // an array to keep track of which fields are marked and not marked
        for (let i = 0; i < 5; i++) {

            getKeycap(fields[i].textContent).style.color = "#fff";
            guessedWord.push(fields[i].textContent);
        }

        if (!allWordsList.includes(guessedWord.join("").toLowerCase())) {
            showError("Not in word list!");
            return 1;
        }


        if (guessedWord.join("") === targetWord.join("")) {
            for (let i = 0; i < 5; i++) {
                fields[i].style.backgroundColor = "#50C878";
                getKeycap(fields[i].textContent).style.backgroundColor = "#50C878";
            }
            showWinMessage(word);
            return 0;
        }

        if (currentRow === 5) {
            showLoseMessage(word);
            return 0;
        }

        for (let i = 0; i < 5; i++) {
            if (guessedWord[i] === targetWord[i]) {
                //change keycap and input field color if the position is correct
                fields[i].style.backgroundColor = "#50C878";
                getKeycap(fields[i].textContent).style.backgroundColor = "#50C878";
                isMarked[i] = true;
                guessedWord[i] = "#";
                targetWord[i] = "*";
            }
        }

        for (let i = 0; i < 5; i++) {
            if ((targetWord.indexOf(guessedWord[i]) !== -1) && !isMarked[i]) {  // Checks if guessedWord[i] exists in word
                //change keycap and input field color if the letter is in word but not in the correct position
                fields[i].style.backgroundColor = "#ceb235";
                getKeycap(fields[i].textContent).style.backgroundColor = "#ceb235";
                isMarked[i] = true;
                guessedWord[i] = "#";
                targetWord[i] = "*";
            }
        }

        for (let i = 0; i < 5; i++) {
            if (!isMarked[i]) {
                fields[i].style.backgroundColor = "#383838";
                getKeycap(fields[i].textContent).style.backgroundColor = "#383838";
                isMarked[i] = true;
                guessedWord[i] = "#";
                targetWord[i] = "*";
            }
        }
        return 0;
    }

    helpBtn.onclick = function () {
        handlePopup(helpBtn);
    };

    shareBtn.onclick = function () {
        navigator.clipboard.writeText("The game link has been copied.")
        const copyTooltip = document.querySelector("#winMessageBottom .tooltipText");
        copyTooltip.textContent = "Copied!";
        setTimeout(() => {
            copyTooltip.textContent = "Copy";
        }, 2000); // Adjust the time as needed
    };

    shareBtnLost.onclick = function () {
        navigator.clipboard.writeText("The game link has been copied.")
        const copyTooltip = document.querySelector("#loseMessageBottom .tooltipText");
        copyTooltip.textContent = "Copied!";
        setTimeout(() => {
            copyTooltip.textContent = "Copy";
        }, 2000); // Adjust the time as needed
    };

    playAgainBtn.onclick = function () {
        resetGame();
    };

    aboutBtn.onclick = function () {
        handlePopup(aboutBtn);
    };

    closeHelpBtn.onclick = function () {
        handlePopup(closeHelpBtn);
    };

    closeAboutBtn.onclick = function () {
        handlePopup(closeAboutBtn);
    };

    function handlePopup(clickedBtn) {
        if (clickedBtn === helpBtn) {
            isListeningKeys = false;
            helpPopup.style.display = "block";
            helpPopup.classList.add("animate");
            overlay.style.display = "block"; //show the overlay

            // close the popup if anything other than the the popup is clicked
            overlay.addEventListener("click", function (event) {
                handlePopup(closeHelpBtn);
            });
        }

        else if (clickedBtn === closeHelpBtn) {
            helpPopup.style.display = "none";
            overlay.style.display = "none"; // hide the overlay
            helpPopup.classList.remove("animate");
            isListeningKeys = true;
        }

        else if (clickedBtn === aboutBtn) {
            isListeningKeys = false;
            aboutPopup.style.display = "block";
            aboutPopup.classList.add("animate");
            overlay.style.display = "block"; //show the overlay

            // close the popup if anything other than the the about popup is clicked
            overlay.addEventListener("click", function (event) {
                handlePopup(closeAboutBtn);
            });
        }

        else if (clickedBtn === closeAboutBtn) {
            aboutPopup.style.display = "none";
            overlay.style.display = "none"; // hide the overlay
            aboutPopup.classList.remove("animate");
            isListeningKeys = true;


        }
    }

    function showError(message) {
        const errorAudio = new Audio("sounds/errorSound.mp3");
        errorAudio.volume = 0.6;
        errorAudio.play();
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.classList.add("animate");
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        // hide the error after a few seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
            errorMessage.classList.remove("animate");
        }, 2000);
    }

    function showWinMessage(word) {
        isListeningKeys = false;
        const winAudio = new Audio("sounds/WonSound.mp3");
        winAudio.volume = 0.6;
        winAudio.play();
        const winMessage = document.getElementById("winMessage");
        const spanElement = document.querySelector("#winMessage p span");
        winMessage.classList.add("animate");
        spanElement.textContent = word;
        winMessage.style.display = 'block';
        overlay.style.display = "block";

        overlay.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }



    function showLoseMessage(word) {
        isListeningKeys = false;
        const loseAudio = new Audio("sounds/lostSound.mp3");
        loseAudio.volume = 0.6;
        loseAudio.play();
        const loseMessage = document.getElementById("loseMessage");
        const spanElement = document.querySelector("#loseMessage p span");
        loseMessage.classList.add("animate");
        spanElement.textContent = word;
        loseMessage.style.display = 'block';
        overlay.style.display = "block";

        overlay.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    playAgainBtn.onclick = function () {
        resetGame();
    };

    tryAgainBtn.onclick = function () {
        resetGame();
    };

    function resetGame() {
        // reset currentRow and currentField
        currentRow = 0;
        currentField = 0;

        // reset input rows
        rows.forEach(row => {
            const fields = row.querySelectorAll(".inputFields");
            fields.forEach(field => {
                field.textContent = "";
                field.style.border = "solid rgb(104, 104, 104) 2px";
                field.style.backgroundColor = "";
            });
        });

        // reset keyboard keyCaps
        keyCaps.forEach(keyCap => {
            keyCap.style.color = "";
            keyCap.style.backgroundColor = "";
        });

        // pick a new random word
        word = (allWordsList[Math.floor(Math.random() * allWordsList.length)]).toUpperCase();
        // reset popups and overlays
        helpPopup.style.display = "none";
        aboutPopup.style.display = "none";
        overlay.style.display = "none";

        // hide error and win messages
        const errorMessage = document.getElementById("errorMessage");
        const winMessage = document.getElementById("winMessage");
        const loseMessage = document.getElementById("loseMessage");
        errorMessage.style.display = "none";
        winMessage.style.display = "none";
        loseMessage.style.display = "none";
        winMessage.querySelector("p span").textContent = "";
        isListeningKeys = true;
    }
});