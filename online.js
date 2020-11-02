let impData = [];
const BASE_SERVER_URL = "http://simon-besendorfer.developerakademie.com/php/";
let url = window.location.href;
let id = url.substring(url.lastIndexOf('=') + 1);

function generatePersonalPage() {
    let id = new Date().getTime();
    let html = `<h2>
        Kopieren und versenden
        </h2>
        <p>versende den untenstehenden Link an alle Teilnehmer!</p>
        <p>personalPage.html?id=${id}</p>
        <a href="personalPage.html?id=${id}"><button id="" href="#" class="myButton" style="margin-top: 12px" onclick="">weiter</button></a>`
    document.getElementById('content').innerHTML ='';
    document.getElementById('content').insertAdjacentHTML('beforeend', html);
}

function getData() {
    console.log("getData NOW");
    load();
    console.log(id);
}

function load() {
    loadJSONFromServer()
        .then(function (result) { //then(function (variable vom server))
            console.log('Laden erfolgreich!', result);
            impData = JSON.parse(result);
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

function determineProxySettings() {
    if (window.location.href.indexOf('.developerakademie.com') > -1) {
        return '';
    } else {
        return 'https://cors-anywhere.herokuapp.com/';
    }
}