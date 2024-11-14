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


    let currentRow = 0;
    let currentField = 0;
    const word = "CRISP";
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
                markGuess(fields);
                // increment the currentRow and reset currentField to 0
                currentRow++;
                currentField = 0;

            }
            else {
                console.log("Not enough words!!")
            }
        }
    }

    function markGuess(fields) {
        // making guessed rows letters white colored
        let guessedWord = [];
        let isMarked = new Array(5).fill(false); // an array to keep track of which fields are marked and not marked
        for (let i = 0; i < 5; i++) {

            getKeycap(fields[i].textContent).style.color = "#fff";
            guessedWord.push(fields[i].textContent);
        }

        for (let i = 0; i < 5; i++) {

            if (guessedWord[i] === word[i]) {
                //change keycap and input field color if the position is correct
                fields[i].style.backgroundColor = "#50C878";
                getKeycap(fields[i].textContent).style.backgroundColor = "#50C878";
                isMarked[i] = true;
                guessedWord[i] = "#";
            }
        }

        console.log(guessedWord);

        for (let i = 0; i < 5; i++) {
            if ((word.indexOf(guessedWord[i]) !== -1) && !isMarked[i]) {  // Checks if guessedWord[i] exists in word
                //change keycap and input field color if the letter is in word but not in the correct position
                fields[i].style.backgroundColor = "#ceb235";
                getKeycap(fields[i].textContent).style.backgroundColor = "#ceb235";
                isMarked[i] = true;
                guessedWord[i] = "#";
            }
        }

        for (let i = 0; i < 5; i++) {
            if (guessedWord[i].indexOf(word) !== -1) {  // Checks if guessedWord[i] exists in word
                //change keycap and input field color if the letter is in word but not in the correct position
                console.log(guessedWord[i]);
                console.log("True!");
                fields[i].style.backgroundColor = "#ceb235";
                getKeycap(fields[i].textContent).style.backgroundColor = "#ceb235";
                isMarked[i] = true;
                guessedWord[i] = "#";
            }
        }

        for (let i = 0; i < 5; i++) {
            if (!isMarked[i]) {
                fields[i].style.backgroundColor = "#383838";
                getKeycap(fields[i].textContent).style.backgroundColor = "#383838";
                isMarked[i] = true;
                guessedWord[i] = "#";
            }
        }

    }

    helpBtn.onclick = function () {
        handlePopup(helpBtn);
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

        }

        else if (clickedBtn === aboutBtn) {
            console.log("handlePopup called with:", clickedBtn);

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

        }
    }
});