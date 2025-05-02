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
    document.getElementById("alphabet").insertAdjacentHTML("beforeend", `<span onclick="cross(this)">${String.fromCharCode(i + 65)}</span>`);
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
        return -1;
    }
    if (!binarySearch(target)){
        document.getElementById("errorMessage").innerHTML = "Word not found, please try a valid English word";
        return -1;
    }
    let ret = 0;
    for (i in target){
        if (tempWord.includes(target[i])){
            ret ++;
            tempWord = tempWord.replace(target[i],"");
        }
    }
    if (ret == 5){
        document.getElementById("guess").value = "";
        document.getElementById("errorMessage").innerHTML = "Congratulations on figuring out the word!";
        guessing = false;
        document.getElementById("enterGuess").removeEventListener("click", makeAGuess(document.getElementById("guess").value.toLowerCase()));
    }else{
        document.getElementById("guess").value = "";
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("guesses").insertAdjacentHTML("afterbegin", `<p>${target}: ${ret}</p>`);
    }
    return ret;
}

function cross(element){
    if (element.innerHTML.includes("<del>")){
        element.innerHTML = element.innerHTML.substring((element.innerHTML.indexOf("</del>")-1), element.innerHTML.indexOf("</del>"));
    }else{
        element.innerHTML = `<del>${element.innerHTML}</del>`;
    }
}