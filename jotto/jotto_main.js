const xhttp = new XMLHttpRequest();
let words;
let secretWord;
let guessing = true;
xhttp.onload = function() {
    words = this.responseText.split('\n');
    //Helper fxns are outside this "onload", anything requiring 'words' to have data must be inside
    secretWord = "sauce";
}
xhttp.open("GET","jotto_words.txt");
xhttp.send();

document.addEventListener("keypress", function(event) {
    if ((event.key == "Enter") && guessing){
        makeAGuess();
    }
});

for (let i = 0; i < 26; i ++){
    document.getElementById("alphabet").insertAdjacentHTML("beforeend", `<span id="letter_${String.fromCharCode(i + 65)}" onclick="cross('${String.fromCharCode(i + 97)}')">${String.fromCharCode(i + 65)}</span>`);
}

function binarySearch(target){
    let l = 0;
    let r = words.length-1;
    let m = Math.floor((l + r) / 2);
    while (l < r){
        if (target == words[m]){
            return true;
        }
        if (target < words[m]){
            r = m-1;
        }else{
            l = m+1;
        }
        m = Math.floor((l + r) / 2);
    }
    return ((target == words[l]) || (target == words[r])) ? true : false;
}

function makeAGuess(){
    if (!guessing){return}
    const target = document.getElementById("guess").value.toLowerCase();
    let tempWord = secretWord;
    if (target.length != 5){
        document.getElementById("errorMessage").innerHTML = "Must guess a five letter word";
        return;
    }
    if (!binarySearch(target)){
        document.getElementById("errorMessage").innerHTML = "Word not found, please try a valid English word";
        return;
    }
    document.getElementById("guess").value = "";
    let letters = 0;
    let toHTML = `<div><span style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;justify-items:center;width:60px">`;
    for (i in target){
        if (tempWord.includes(target[i])){
            letters ++;
            tempWord = tempWord.replace(target[i],"");
        }
        toHTML += `<span onclick="cross('${target[i]}')">`;
        if (document.getElementById("letter_" + target[i].toUpperCase()).innerHTML.includes("<del>")){
            toHTML += `<del>${target[i]}</del>`;
        }else{
            toHTML += target[i];
        }
        toHTML += "</span>";
    }
    document.getElementById("guessBody").insertAdjacentHTML("afterbegin", toHTML + `</span><span>${letters}</span></div>`);
    if (letters == 5){
        guessing = false;
        document.getElementById("errorMessage").innerHTML = "Congratulations on figuring out the word!";
    }else{
        document.getElementById("errorMessage").innerHTML = "";
    }
}

function cross(letter){
    //Go through all guesses and finish with the alphabet, crossing/uncrossing as needed
    const alpha = document.getElementById(`letter_${letter.toUpperCase()}`);
    if (alpha.innerHTML.includes("<del>")){
        alpha.innerHTML = letter.toUpperCase();
    }else{
        alpha.innerHTML = `<del>${letter.toUpperCase()}</del>`;
    }

    document.getElementById("guessBody").childNodes.forEach(function(node){
        node.childNodes[0].childNodes.forEach(function(char){
            if (char.innerHTML.includes("<del>")){
                if (char.innerHTML.includes(`>${letter}<`)){
                    char.innerHTML = letter;
                }
            }else{
                if (char.innerHTML == letter){
                    char.innerHTML = `<del>${letter}</del>`;
                }
            }
        });
    });
}