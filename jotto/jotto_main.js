const daysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const dateObj = new Date();
dateObj.setHours(dateObj.getUTCHours()-4);
let xhttp = new XMLHttpRequest();
let words;
let dailyWords;
let secretWord;
let guessing = true;
xhttp.onload = function() {
    words = this.responseText.split('\n');
    //Helper fxns are outside this "onload", anything requiring 'words' to have data must be inside
}
xhttp.open("GET","jotto_words.txt");
xhttp.send();

xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    dailyWords = this.responseText.split('\n');
    if (dailyWords.length < 365){
        for (let i = 2; i < 365; i ++){
            dailyWords.push(rand(0, 10000, true).toString());
        }
        //306 is for May 11th
        dailyWords[306] = '7934';
    }
}
xhttp.open("GET","daily_words.txt");
xhttp.send();

document.addEventListener("keypress", function(event) {
    if (guessing && (event.key == "Enter")){
        makeAGuess();
    }
});

for (let i = 0; i < 26; i ++){
    document.getElementById("alphabet").insertAdjacentHTML("beforeend", `<span id="letter_${String.fromCharCode(i + 65)}" onclick="cross('${String.fromCharCode(i + 97)}')">${String.fromCharCode(i + 65)}</span>`);
}

function chooseWord(type){
    let i = (daysInMonth[dateObj.getMonth()] + dateObj.getDate()) - 190;
    if (i < 0){
        i += 365;
    }
    i = dailyWords[i];
    if (type == "random"){
        let temp = rand(0, words.length);
        i = (temp == i) ? ((temp * 17) % words.length) : temp;
    }
    secretWord = words[i];
    console.log(secretWord);
    document.getElementById("spec-modal").style.display = "none";
}

function makeAGuess(){
    if (!guessing){return}
    const target = document.getElementById("guess").value.toLowerCase();
    let tempWord = secretWord;
    if (target.length != 5){
        document.getElementById("errorMessage").innerHTML = "Must guess a five letter word";
        return;
    }
    if (binarySearch(words, target) == -1){
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
        toHTML += `<span onclick="cross('${target[i]}')" style="font-weight:700`;
        let col = document.getElementById("letter_" + target[i].toUpperCase()).style.color;
        if (col == "red"){
            toHTML += ";color:red";
        }else if (col == "green"){
            toHTML += ";color:green";
        }
        toHTML += `">${target[i]}</span>`;
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
    cycleColors(document.getElementById(`letter_${letter.toUpperCase()}`).style);

    document.getElementById("guessBody").childNodes.forEach(function(node){
        node.childNodes[0].childNodes.forEach(function(char){
            if (char.innerHTML == letter){
                cycleColors(char.style);
            }
        });
    });
}

function cycleColors(element){
    if (element.color == ""){
        element.color = "red";
    }else if (element.color == "red"){
        element.color = "green";
    }else{
        element.color = "";
    }
}

//Helper fxns

function binarySearch(arr, target){
    let l = 0;
    let r = arr.length-1;
    let m = Math.floor((l + r) / 2);
    while (l < r){
        if (target == arr[m]){
            return m;
        }
        if (target < arr[m]){
            r = m-1;
        }else{
            l = m+1;
        }
        m = Math.floor((l + r) / 2);
    }
    if (target == arr[l]){
        return l;
    }
    return (target == arr[r]) ? r : -1;
}

function rand(min, max, includeMax = false){
    if (includeMax){
        return Math.floor(Math.random() * ((max - min) + 1)) + min;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

function setCookie(cname, cvalue, expire = 30){
    let d = new Date();
    d.setTime(d.getTime() + (expire * 1000 * 60 * 60 * 24));
    document.cookie = (cname + "=" + cvalue + ";expires=" + d.toUTCString + ";path=/");
}

function getCookie(cname){
    cname += "=";
    let decoded = document.cookie.split(";");
    for (let i in decoded){
        while (decoded[i].charAt(0) == " "){
            decoded[i] = decoded[i].substring(1);
        }
        if (decoded[i].indexOf(cname) == 0){
            return decoded[i].substring(cname.length);
        }
    }
    return "No cookie found";
}