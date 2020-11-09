const BASE_SERVER_URL = "http://simon-besendorfer.developerakademie.com/php/";

let impData = [];
let url = window.location.href;
let id = url.substring(url.lastIndexOf('=') + 1);
let indexOfGroup = null;


function generatePersonalPage() {
    let id = new Date().getTime();
    let html = `<h2>
        Kopieren und versenden
        </h2>
        <p>versende den untenstehenden Link an alle Teilnehmer!</p>
        <p>personalPage.html?id=${id}</p>
        <a href="personalPage.html?id=${id}"><button id="" href="#" class="myButton" style="margin-top: 12px" onclick="">weiter</button></a>`
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').insertAdjacentHTML('beforeend', html);

}

function getData() {
    console.log("getData NOW");
    load();
    console.log("this is the id from URL " + id);
}

function load() {
    loadJSONFromServer()
        .then(function (result) { //then(function (variable vom server))
            console.log('Laden erfolgreich!', result);
            impData = JSON.parse(result);
            checkForMatch();
        })
        .catch(function (error) { // Fehler
            console.error('Fehler beim laden!', error);
        });
}

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

function saveJSONToServer(payload) {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        let serverURL = BASE_SERVER_URL + "save_json.php";
        xhttp.open("POST", serverURL); // POST = Erstellen; GET = Abrufen; DELETE = Löschen, PUT = Updaten

        xhttp.onreadystatechange = function (oEvent) {
            if (xhttp.readyState === 4) {
                // Nr. 4 bedeutet, dass der Server eine Antwort gesendet hat
                // Eine Antwort hat 2 Teile: a) Statuscode; b) payload
                // 404 = Nicht gefunden
                // 200 = Alles OK
                // 202 = Datei erstellt

                if (xhttp.status >= 200 && xhttp.status <= 399) {
                    // Alles super, es hat funktioniert!
                    resolve(xhttp.responseText);
                } else {
                    // Ein Fehler ist aufgetreten
                    reject(xhttp.statusText);
                }
            }
        };

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(payload));
    });
}

function determineProxySettings() {
    if (window.location.href.indexOf('.developerakademie.com') > -1) {
        return '';
    } else {
        return 'https://cors-anywhere.herokuapp.com/';
    }
}



function checkForMatch() {
    for (let i = 0; i < impData.length; i++) {
        if (impData[i].ID == id) {
            indexOfGroup = i;
            console.log("Treffer " + i);
            showParticipants();
            }
    }
    if (indexOfGroup == null) {
        console.log('no ID found');
        indexOfGroup = impData.length +1;
        //save new ID
        let newFam = createImpFamily();
        impData.push(newFam);
        saveJSONToServer(impData)
        .then(function (result) { //then(function (variable vom server))
            console.log('Laden erfolgreich!', result);
            getData();
    })
        .catch(function (error) { // Fehler
            console.error('Fehler beim laden!', error);
        });

    }
    if (impData[indexOfGroup].participants[0] != impData[indexOfGroup].Shuffled[0]) {
        showResult();
    }
}

function showParticipants() {
    console.log(impData[indexOfGroup].participants);
    for (let i = 0; i < impData[indexOfGroup].participants.length; i++) {
        console.log(impData[indexOfGroup].participants[i]);
        let HTML = '<li>' + impData[indexOfGroup].participants[i] + '</li>';
        document.getElementById('participants').insertAdjacentHTML('beforeend', HTML);
    }
}

function addParticipant() {
    console.log(impData[indexOfGroup].participants.length);
    let i = impData[indexOfGroup].participants.length;
    let name = document.getElementById('name').value;
    let pass = document.getElementById('pass').value;
    impData[indexOfGroup].counter = impData[indexOfGroup].counter +1;
    impData[indexOfGroup].participants.push(name);
    impData[indexOfGroup].Shuffled.push(name);
    impData[indexOfGroup].Key.push(pass);
    //string = JSON.stringify(impData);
    saveJSONToServer(impData)
        .then(function (result) { //then(function (variable vom server))
            console.log('Laden erfolgreich!', result);
            getData();
            addMessage();
    })
        .catch(function (error) { // Fehler
            console.error('Fehler beim laden!', error);
        });
}

function createImpFamily(){
    let family = {
        'ID': parseFloat(id),
        'counter': null,
        'participants': [],
        'Shuffled': [],
        'Key': []
    }
    return family;
}

function addMessage(){
    let content = document.getElementById('content');
    content.innerHTML = '';
    let html = `
    <h2>Deine Name wurde hinzugefügt</h2>
    <p>Merke oder notiere dir dein Passwort, um nach der Ziehung dein Ergebnis abzufragen!</p>
    <p>Wenn alle Teilnehmer eingetragen sind, kannst du die Ergebnisse auslosen</p>
    <p>WICHTIG! Es müssen mindestens 3 Teilnehmer sein</p>
    <a href="personalPage.html?id=${id}"><button id="" href="#" class="myButton" style="margin-top: 12px">weiterer Teilnehmer</button></a>
    <button id="" href="#" class="myButton" style="margin-top: 12px" type="">Ziehung starten</button>
    <h2>Bereits in der Gruppe:</h2>
    <ul id="participants"></ul>
    `;
    content.insertAdjacentHTML('beforeend', html);
}

function showResult(){
    console.log("Alarm");
    let content = document.getElementById('content');
    content.innerHTML = '';
    let html = `
    <h2>Die Ziehung ist Abgeschlossen</h2>
    <p>Log dich hier ein, um dein Ergebnis abzufragen!<p>
    <form style="display: flex; flex-direction: column;" action="#" onsubmit="showPersonalImp(); return false;">
    <input id="name" style="margin-top: 12px;" type="text" required minlength="3" placeholder="Name">
    <input id="pass" style="margin-top: 12px;" type="password" required minlength="4" placeholder="Code">
    <button id="" href="#" class="myButton" style="margin-top: 12px" type="submit" type="button">Ergebnis anzeigen</button>
    </form>
    <h2>Teilgenommen:</h2>
    <ul id="participants"></ul>
    `;
    content.insertAdjacentHTML('beforeend', html);
    showParticipants();
}

function showPersonalImp(){
    alert("oh yeah");
}