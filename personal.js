let participants = [];
let shuffled = [];
let counter = 0;

function addParticipant() {
    let participant = document.getElementById('participant').value;
    participants.push(participant);
    shuffled.push(participant);
    console.log(participants);
    document.getElementById('participantsList').insertAdjacentHTML('beforeend', '<li>' + participant + '</li>')
    document.getElementById('participant').value = '';
    counter = counter + 1;
    console.log(counter);
    checkForNext();
}

function checkForNext() {
    if (counter >= 3) {
        document.getElementById('nextBtn').classList.remove('d-none');
    }
}


// Fucntion to shuffle the array content 
function shuffle() {

    for (let i = shuffled.length - 1; i > 0; i--) {
        // Generate random number  
        let j = Math.floor(Math.random() * (i + 1));

        let temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    console.log(shuffled);
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
        getImp();
    }
}

function getImp() {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>
    Unser Wichtel hat den Topf geschüttelt!
    </h2>
    <p>Gib das Handy an</p>
    <h2>${participants[0]}</h2>
    <p>weiter!</p>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="">weiter</button>`;
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}