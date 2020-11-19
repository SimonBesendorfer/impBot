const BASE_SERVER_URL = "http://simon-besendorfer.developerakademie.com/impBot/php/";

let impData = [];
let url = window.location.href;
let id = url.substring(url.lastIndexOf('=') + 1);
let indexOfGroup = null;
let yourNameID = null;
let deleteOlderThan = 30; //in Days -- Content older than the set Days will be deletet when the function deleteOldFamily() is started

/**
 * The function generatePersonalPage() generates an individual link for every Group by using the
 * unix Time Stamp as an extention for URL "http://***.com/personalPage.html?ID=1605171452000"
 * Before you get on the Page it is displayd in online.html and shoud be copied and sent to the
 * invitet Members in the Group.
 */
function generatePersonalPage() {
    let id = new Date().getTime();
    let hostname = window.location.hostname;
    let personalLink = hostname + '/impBot/personalPage.html?id=' + id;
    let html = `<h2>
        Kopieren und versenden
        </h2>
        <p>versende den untenstehenden Link an alle Teilnehmer!</p>
        <input type="text" value="${personalLink}" id="copyLink">
        <button id="" href="#" class="myButton" style="margin-top: 12px" onclick="copyToClipboard()">Link kopieren</button>
        <a href="personalPage.html?id=${id}"><button id="" href="#" class="myButton" style="margin-top: 12px" onclick="">weiter</button></a>`
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').insertAdjacentHTML('beforeend', html);
}

/**
 * copyToClipboard() will copy the individual Link to the Device Clipboard
 */
function copyToClipboard() {
    let copiedLink = document.getElementById('copyLink');
    copiedLink.select();
    copiedLink.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.getElementById('linkCopied').classList.remove('d-none');
    setTimeout(function () {
        document.getElementById('linkCopied').classList.add('d-none');
    }, 5000);
}

/**
 * The function load() starts the function loadJSONFromServer() when the personalPage is loaded.
 * When the JSON is loaded, a statement will be displayed.
 * in the console, the JSON will be parsed to impData and the function checkForMatch() will be startet.
 * If there is a Problem with loading, a Message will be displayed in the console.
 */
function load() {
    startLoadingAnimation();
    loadJSONFromServer()
        .then(function (result) { //then(function (variable vom server))
            console.log('Laden erfolgreich!', result);
            impData = JSON.parse(result);
            checkForMatch();
            stopLoadingAnimation();
            checkIfShuffled();
        })
        .catch(function (error) { // Fehler
            console.error('Fehler beim laden!', error);
            serverError();
        });
}

/**
 * loadJSONFromServer() contains all the nessesary information for getting the JSON from the server.
 */
function loadJSONFromServer() {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        let proxy = determineProxySettings();
        let serverURL = proxy + BASE_SERVER_URL + 'online.json';
        xhttp.open('GET', serverURL);

        xhttp.onreadystatechange = function (oEvent) {
            if (xhttp.readyState === 4) {
                if (xhttp.status >= 200 && xhttp.status <= 399) {
                    resolve(xhttp.responseText);
                } else {
                    reject(xhttp.statusText);
                }
            }
        };
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader("Cache-Control", "no-cache");
        xhttp.send();
    });
}

/** 
 * saveJSONToServer() contains all the nessesary information for saving the JSON on the Server.
 * It is an post statement and will replace the current available JSON with a totaly new one.
 * 
 */
function saveJSONToServer(payload) {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        let serverURL = BASE_SERVER_URL + "save_json.php";
        xhttp.open("POST", serverURL);
        xhttp.onreadystatechange = function (oEvent) {
            if (xhttp.readyState === 4) {
                if (xhttp.status >= 200 && xhttp.status <= 399) {
                    resolve(xhttp.responseText);
                } else {
                    reject(xhttp.statusText);
                }
            }
        };
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(payload));
    });
}

/**
 * determineProxySettings() contains functionality for testing in offline mode.
 */
function determineProxySettings() {
    if (window.location.href.indexOf('.developerakademie.com') > -1) {
        return '';
    } else {
        return 'https://cors-anywhere.herokuapp.com/';
    }
}

/**
 * checkForMatch() checks, if the individual Page ID matches with an ID in the JSON.
 * If there is a Match, the i is saved as indexOfGroup and all the participants will be displayed
 * by the function showParticipants(). If there are more then 3 Player, the start Shuffle Button will be displayed.
 * If there is no matching ID in the JSON, a new Group (newFam) will bei pusht to the Array, saved to the Server
 * and reloaded. 
 * It will start the function checkIfShuffled().
 */
function checkForMatch() {
    for (let i = 0; i < impData.length; i++) {
        if (impData[i].ID == id) {
            indexOfGroup = i;
            showParticipants();
            if (impData[indexOfGroup].participants.length >= 3) {
                document.getElementById('startShuffle').classList.remove('d-none');
            }
        }
    }
    if (indexOfGroup == null) {
        indexOfGroup = impData.length;
        let newFam = createImpFamily();
        impData.push(newFam);
    }
}

/**
 * checkIfShuffled() checks if the loaded family is new. If not, it will check, if the current group
 * already is shuffled.
 */
function checkIfShuffled() {
    if (impData[indexOfGroup] != undefined) {
        if (impData[indexOfGroup].participants[0] != impData[indexOfGroup].Shuffled[0]) {
            showResult();
        }
    }
}

/**
 * The function showParticipants() displays all members of a group in html.
 */
function showParticipants() {
    for (let i = 0; i < impData[indexOfGroup].participants.length; i++) {
        let HTML = '<li>' + impData[indexOfGroup].participants[i] + '</li>';
        document.getElementById('participants').insertAdjacentHTML('beforeend', HTML);
    }
}

/**
 * addParticipant() adds a new member to the individual group and saves it to the Server,
 * starts the function getData() and addMEssage().
 */
function addParticipant() {
    let i = impData[indexOfGroup].participants.length;
    let name = document.getElementById('name').value;
    let pass = document.getElementById('pass').value;
    let nameConflict = false;
    impData[indexOfGroup].counter = impData[indexOfGroup].counter + 1;

    for (i = 0; i < impData[indexOfGroup].participants.length; i++) {
        if (name == impData[indexOfGroup].participants[i]) {
            nameConflict = true;
        }
    }
    if (nameConflict == true) {
        document.getElementById('name').value = '';
        document.getElementById('pass').value = '';
        document.getElementById('nameConflict').classList.remove('d-none');
        setTimeout(function () {
            document.getElementById('nameConflict').classList.add('d-none');
        }, 6000)
    } else {
        impData[indexOfGroup].participants.push(name);
        impData[indexOfGroup].Shuffled.push(name);
        impData[indexOfGroup].Key.push(pass);
        startLoadingAnimation();
        saveJSONToServer(impData)
            .then(function (result) {
                console.log('Laden erfolgreich!', result);
                stopLoadingAnimation();
                addMessage();
                showParticipants();
            })
            .catch(function (error) {
                console.error('Fehler beim laden!', error);
                serverError();
            });
    }
}



/**
 * createImpFamily() Creates a new empty Group (family) which will be added to the JSON
 * impData and later saved on the server.
 */
function createImpFamily() {
    let family = {
        'ID': parseFloat(id),
        'counter': parseFloat(0),
        'participants': [],
        'Shuffled': [],
        'Key': []
    }
    return family;
}

/**
 * addMessage() shows information in html after adding a new member to the group
 */
function addMessage() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    let html = `
    <h2>Deine Name wurde hinzugefügt</h2>
    <p>Merke oder notiere dir dein Passwort, um nach der Ziehung dein Ergebnis abzufragen!</p>
    <p>Wenn alle Teilnehmer eingetragen sind, kannst du die Ergebnisse auslosen</p>
    <p>WICHTIG! Es müssen mindestens 3 Teilnehmer sein</p>
    <a href="personalPage.html?id=${id}"><button id="" href="#" class="myButton" style="margin-top: 12px">weiterer Teilnehmer</button></a>
    <button id="shuffle" onclick="shureToShuffle()" href="#" class="myButton d-none" style="margin-top: 12px" type="">Ziehung starten</button>
    <h2>Bereits in der Gruppe:</h2>
    <ul id="participants"></ul>
    `;
    content.insertAdjacentHTML('beforeend', html);
    if (impData[indexOfGroup].counter >= 3) {
        document.getElementById('shuffle').classList.remove('d-none');
    }
}

/**
 * showResult() shows information in html, that the function shuffle() allready has been startet and
 * displays the the form and button which can start the function showPersonalImp().
 */
function showResult() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    let html = `
    <h2>Die Ziehung ist Abgeschlossen</h2>
    <p>Log dich hier ein, um dein Ergebnis abzufragen!<p>
    <form style="display: flex; flex-direction: column;" action="#" onsubmit="showPersonalImp(); return false;">
    <input id="name" style="margin-top: 12px;" type="text" required minlength="3" placeholder="Name">
    <input id="pass" style="margin-top: 12px;" type="password" required minlength="4" placeholder="Passwort">
    <button id="" href="#" class="myButton" style="margin-top: 12px" type="submit" type="button">Ergebnis anzeigen</button>
    </form>
    <h2>Teilgenommen:</h2>
    <ul id="participants"></ul>
    `;
    content.insertAdjacentHTML('beforeend', html);
    showParticipants();
}

/**
 * showPersonalImp() checks, if the enterd name and password matches with the data from the JSON.
 * If there is a match, the function showPersonToGivePresent() will be startet,
 * if the password is not matching, a popup Info will apear for 4 sec.
 */
function showPersonalImp() {
    let participant = document.getElementById('name').value;
    let key = document.getElementById('pass').value;
    for (let i = 0; i < impData[indexOfGroup].participants.length; i++) {
        if (participant == impData[indexOfGroup].participants[i]) {
            yourNameID = i;
        }
    }
    if (key == impData[indexOfGroup].Key[yourNameID]) {
        showPersonToGivePresent();
    }
    if (key != impData[indexOfGroup].Key[yourNameID]) {
        document.getElementById("wrongPass").classList.remove('d-none');
        setTimeout(function () {
            document.getElementById("wrongPass").classList.add('d-none');
        }, 4000);
    }
}

/**
 * showPersonToGivePresent() displays the Information which person in the individual goup matches after
 * shuffeling.
 */
function showPersonToGivePresent() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    let html = `
    <h2>Dein persönliches Ergebnis</h2>
    <p>Du wirst<p>
    <h3>${impData[indexOfGroup].Shuffled[yourNameID]}</h3>
    <p>beschenken</p>
    <p>Merke oder notiere dir den Namen und verrate niemanden wen du beschenken wirst!</p>
    <p>Wichtel Bot wünscht dir und deinen Liebsten frohe Weihnachten!</p>
    <button onclick="deleteOldFamily()" class="myButton" style="margin-top: 12px">zurück zur Startseite</button>
    `;
    content.insertAdjacentHTML('beforeend', html);
}

/**
 * shureToShufle() displays a warning message and explans, that the function shuffle() only
 * one time can be startet.
 */
function shureToShuffle() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    let html = `
    <h2>Bist du sicher?</h2>
    <p>Bitte überprüfe nochmals die Teilnehmerliste. Du kannst danach keine Personen mehr hinzufügen.<p>
    <h3>Teilnehmer:</H3>
    <ul id="participants"></ul>
    <a href="index.html"><button class="myButton" style="margin-top: 12px">Abbrechen</button></a>
    <button class="myButton" onclick="shuffle()" style="margin-top: 12px">Ziehung starten</button>
    `;
    content.insertAdjacentHTML('beforeend', html);

    for (let i = 0; i < impData[indexOfGroup].participants.length; i++) {
        let list = '<li>' + impData[indexOfGroup].participants[i] + '</li>';
        document.getElementById('participants').insertAdjacentHTML('beforeend', list);
    }
}

/**
 * shuffle() Mixes the group Array Shuffled and starts the function checkForConflict().
 */
function shuffle() {
    for (let i = impData[indexOfGroup].Shuffled.length - 1; i > 0; i--) {
        // Generate random number  
        let j = Math.floor(Math.random() * (i + 1));

        let temp = impData[indexOfGroup].Shuffled[i];
        impData[indexOfGroup].Shuffled[i] = impData[indexOfGroup].Shuffled[j];
        impData[indexOfGroup].Shuffled[j] = temp;
    }
    checkForConflict();
}

/**
 * checkForConflict() compares participants and Shuffled at the same Array position. If there is anywhere the same
 * name, the function shuffle will be startet again. If there is no match, the JSON will be saved to the server.
 */
function checkForConflict() {
    let conflict = false;
    for (let i = 0; i < impData[indexOfGroup].Shuffled.length; i++) {
        if (impData[indexOfGroup].Shuffled[i] == impData[indexOfGroup].participants[i]) {
            conflict = true;
        }
    }
    if (conflict === true) {
        shuffle();
    }
    if (conflict == false) {
        saveJSONToServer(impData)
            .then(function (result) { //then(function (variable vom server))
                console.log('Laden erfolgreich!', result);
                location.reload();
            })
            .catch(function (error) {
                console.error('Fehler beim laden!', error);
                serverError();
            });
    }
}


/**
 * Displays an Error Message if there is any trouble with the connection to the server
 */
function serverError() {
    document.getElementById('serverError').classList.remove('d-none');
    stopLoadingAnimation();
}

/**
 * deleteOldFamily() is started after klicking on the button "zurück zum Start"
 */
function deleteOldFamily() {
    let currentTime = new Date().getTime();
    let deleteIDlowerThan = currentTime - (deleteOlderThan * 86400000); //86400000 miliseconds = 1 day
    for (i = 0; i < impData.length; i++) {
        if (impData[i].ID < deleteIDlowerThan || impData[i].ID == null) {
            impData.splice(i, 1);
            i = i - 1;
        }
    }
    saveJSONToServer(impData)
        .then(function (result) {
            console.log('Laden erfolgreich!', result);
            stopLoadingAnimation();
            window.location.replace("http://simon-besendorfer.developerakademie.com/impBot/index.html");
        })
        .catch(function (error) {
            console.error('Fehler beim laden!', error);
            serverError();
        });
}