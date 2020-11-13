let participants = [];
let shuffled = [];
let counter = 0;

/**
 * addParticipant() adds the entered Name to the Array participants and shuffled.
 * Before the Name is added, the entered value is checkt, if it is already in the array.
 * If it is already in the array, an Error Message will be displayed and the name will NOT be added to the Array.
 * The function checkForNext() will be started.
 */
function addParticipant() {
    let participant = document.getElementById('participant').value;
    let nameConflict = false;
    for (i = 0; i < participants.length; i++) {
        if (participant == participants[i]) {
            nameConflict = true;
        }
    }
    if (nameConflict == true) {
        document.getElementById('participant').value = '';
        document.getElementById('nameConflict').classList.remove('d-none');
        setTimeout(function(){
            document.getElementById('nameConflict').classList.add('d-none');
        }, 6000)
    } else {
        participants.push(participant);
        shuffled.push(participant);
        document.getElementById('participantsList').insertAdjacentHTML('beforeend', '<li>' + participant + '</li>')
        document.getElementById('participant').value = '';
        counter = counter + 1;
        checkForNext();
    }
}

/**
 * checkForNext() checks, if there are already 3 or more participants in the Arrays (participants and shuffled)
 */
function checkForNext() {
    if (counter >= 3) {
        document.getElementById('nextBtn').classList.remove('d-none');
    }
}

/**
 * shuffle() is started by clicking on the button "weiter". It will shuffle the Array Position
 * of the Names in the Array shuffled.
 * After the array is shuffled, the checkForConflict() function will be started. 
*/
function shuffle() {
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    checkForConflict();
}

/**
 * checkForConflict() checks, if the name[i] in the participants Array is the same name as it is
 * in at the same position in the Array shuffled. All Array positions will be checkt.
 * If there is the same name on any place, the function shuffle() will be started again.
 * If there is no conclict, the function solution() will be started.
 */
function checkForConflict() {
    let conflict = false;
    for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] == participants[i]) {
            conflict = true;
        }
    }
    if (conflict === true) {
        shuffle();
    } else {
        startLoadingAnimation();
        setTimeout(function () {
            stopLoadingAnimation();
        }, 3500)
        solution();
    }
}

/**
 * It defines the parameter i and starts the getImp() function
 */
function solution() {
    let i = 0;
    getImp(i);
}

/**
 * getImp() will Display Result information and is one of the functions, which leads you thru the results.
 * @param {number of array position which will be showed} i 
 */
function getImp(i) {
    if (i < counter) {
        document.getElementById('content').innerHTML = '';
        let HTML = `<h2>
        Unser Wichtel hat den Topf geschüttelt!
        </h2>
        <p>Gib das Handy an</p>
        <h2>${participants[i]}</h2>
        <p>weiter!</p>
        <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="checkPerson(${i})">weiter</button>
        `;
        document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
    } if (i == counter) {
        finish();
    }
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>
    Unser Wichtel hat den Topf geschüttelt!
    </h2>
    <p style="margin-top: 24px">Gib das Handy an</p>
    <h2>${participants[i]}</h2>
    <p>weiter!</p>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="checkPerson(${i})">weiter</button>
    `;
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

/**
 * checkPerson() will Display Result Information and is one of the functions, whick leads you thru the results.
 * @param {number of array position which will be showed} i 
 */
function checkPerson(i) {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>Bist du ${participants[i]}?
    </h2>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="showResult(${i})">Ja!</button>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="getImp(${i})">Nein!</button>
    `
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

/**
 * showResult() will Display Result Information and is one of the functions, whick leads you thru the results.
 * @param {number of array position which will be showed} i 
 */
function showResult(i) {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>${participants[i]}</h2>
    <p>du wirst <b>${shuffled[i]}</b> beschenken!</p>
    <button id="nextBtn" href="#" class="myButton" style="margin-top: 12px" onclick="next(${i})">weiter</button>
    `
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}

/**
 * next() will Display Result Information and is one of the functions, whick leads you thru the results.
 * adds +1 th the parameter which is responsible for showing the array position.
 * @param {number of array position which will be showed} i 
 */
function next(i) {
    a = i + 1;
    if (a < counter) {
        getImp(a);
    } else {
        finish();
    }
}

/**
 * finish() shows a final Screen and gives the option for going back to index.html
 */
function finish() {
    document.getElementById('content').innerHTML = '';
    let HTML = `<h2>Frohe Weihnachten</h2>
    <p>jeder von euch weiß nun, wem er beschenken sollte</p>
    <a href="index.html"><button id="nextBtn" href="index.html" class="myButton" style="margin-top: 12px" onclick="">weiter</button><a>
    `
    document.getElementById('content').insertAdjacentHTML("beforeend", HTML);
}