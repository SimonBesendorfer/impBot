let participants = [];
let shuffled = [];
let counter = 0;

function addParticipant() {
    let participant = document.getElementById('participant').value;
    participants.push(participant);
    shuffled.push(participant);
    document.getElementById('participantsList').insertAdjacentHTML('beforeend', '<li>' + participant + '</li>')
    document.getElementById('participant').value = '';
    counter = counter + 1;
    checkForNext();
}

function checkForNext() {
    if (counter >= 3) {
        document.getElementById('nextBtn').classList.remove('d-none');
    }
}


/**
 * 
 * Fucntion to shuffle the array content 
*/
 function shuffle() {

    for (let i = shuffled.length - 1; i > 0; i--) {
        // Generate random number  
        let j = Math.floor(Math.random() * (i + 1));

        let temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    checkForConflict();
}

// Checks if the shuffled array mataches on any place with the previous array position
function checkForConflict() {
    let conflict = false;
    for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] == participants[i]) {
            conflict = true;
        }
    }
    console.log(conflict);
    if (conflict === true) {
        shuffle();
    } else {
        document.getElementById('glass').classList.remove('d-none');
        setTimeout(function(){
            document.getElementById('glass').classList.add('d-none'); 
            solution();       
        }, 1500)
        //solution();
    }
}

function solution() {
    let i = 0;
    document.getElementById('glass').classList.remove('d-none');
    setTimeout(function(){
        //document.getElementById('glass').classList.add('d-none');        
    }, 1500)
    getImp(i);
}

function getImp(i) {
    console.log('i ist ' + i + ' counter ist ' + counter);
    if (i < counter) {
        document.getElementById('content').innerHTML = '';
        let HTML = `<h2>
        Unser Wichtel hat den Topf geschüttelt!
        </h2>
        <p>Gib das Handy an</p>
        <h2>${participants[i]}</h2>
        <p>weiter!</p>
        <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="checkPerson(${i})">weiter</button>
        <img style="width: 100px;" id="glass" class="jiggle d-none" src="img/glass.png">`;
        document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
    } if (i == counter) {
        finish();
    }

    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>
    Unser Wichtel hat den Topf geschüttelt!
    </h2>
    <p>Gib das Handy an</p>
    <h2>${participants[i]}</h2>
    <p>weiter!</p>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="checkPerson(${i})">weiter</button>
    <img style="width: 100px;" id="glass" class="jiggle d-none" src="img/glass.png">`;
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

function checkPerson(i) {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>Bist du ${participants[i]}?
    </h2>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="showResult(${i})">Ja!</button>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="getImp(${i})">Nein!</button>
    `
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

function showResult(i) {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>${participants[i]}</h2>
    <p>du wirst ${shuffled[i]} beschenken!</p>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="next(${i})">weiter</button>
    `
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

function next(i) {
    a = i + 1;
    console.log('a ist ' + a);
    if (a < counter) {
        getImp(a);
    } else {
        finish();
    }
}

function finish() {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>Frohe Weihnachten</h2>
    <p>jeder von euch weiß nun, wem er beschenken sollte</p>
    <a href="index.html"><button id="nextBtn" href="index.html" class="myButton" style="margin-top: 12px" onclick="">weiter</button><a>
    `
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

