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