document.addEventListener("DOMContentLoaded", () => {

    // initializating global constants
    const rows = document.querySelectorAll(".inputRows");
    const helpBtn = document.getElementById("helpBtn");
    const helpPopup = document.getElementById("helpPopup");
    const rootDiv = document.getElementById("root");
    const keyboardContainer = document.getElementById("keyboardContainer");
    const overlay = document.getElementById("overlay");

    const closeHelpBtn = document.getElementById("closeHelpBtn");

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

                // remove animation class after 200ms
                setTimeout(() => {
                    if (currentField < fields.length) {  // for some reason and to avoid timing issues check this condition again(a TypeError will occur otherwise)
                        fields[currentField - 1].classList.remove("animate");
                    }
                }, 300);

                // add a white border around the input box for the sake of aesthetics
                fields[currentField].style.border = "solid 2px white";

                // increment currentField
                currentField++;
            }
        }

        else if (key === "Backspace") {
            // if backspace is pressed, delete the previous field
            if (currentField > 0) {
                // reset white border around the input box after deleting for the sake of aesthetics(again)
                fields[currentField - 1].style.border = "solid rgb(104, 104, 104) 2px";
                currentField--;
                fields[currentField].textContent = "";
            }
        }

        else if (key === "Enter") {
            // if row is complete, make fields unmodifiable
            if (currentField === fields.length) {
                fields.forEach(field => field.classList.add("locked"));

                // check every letter of a row for correct letter and position, correct letter wrong position, and wrong letter
                for (let i = 0; i < 5; i++) {
                    getKeycap(fields[i].textContent).style.color = "#fff";

                    if (fields[i].textContent === word[i]) {
                        //change keycap and input field color if the position is correct
                        fields[i].style.backgroundColor = "#50C878";
                        getKeycap(fields[i].textContent).style.backgroundColor = "#50C878";
                    }
                    else if (word.includes(fields[i].textContent)) {
                        //change keycap and input field color if the position is incorrect
                        fields[i].style.backgroundColor = "#ceb235";
                        getKeycap(fields[i].textContent).style.backgroundColor = "#ceb235";

                    }
                    else {
                        //change keycap and input field color if the letter is not in the word
                        fields[i].style.backgroundColor = "#383838";
                        getKeycap(fields[i].textContent).style.backgroundColor = "#383838";
                    }
                }

                // increment the currentRow and reset currentField to 0
                currentRow++;
                currentField = 0;
            }

            else {
                console.log("Not enough words!!")
            }
        }
    }


    helpBtn.onclick = function () {
        handlePopup(helpBtn);
    };

    closeHelpBtn.onclick = function () {
        handlePopup(closeHelpBtn);
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
    }
});