
let spielfeldgroesse = 0;
let zeitEinstellung = 0;
let felder = [];
let spielAktiv = false;
let klickVerboten = false;
let countdown;
let memKlasse;

function spielAufbau() {
    $('#memory').empty();
    $('#memory').addClass('hidden').removeClass('grid').removeClass(memKlasse).empty();
    $('#msg').addClass('hidden');
    $('#settings').removeClass('hidden');
    $('#countdown').addClass('hidden');
}

spielAufbau();

function getsettings() {
    spielfeldgroesse = $("input[name='spielbrett']:checked").val();
    zeitEinstellung = $("input[name='schwierigkeitsgrad']:checked").val();
    zeitEinstellung = zeitEinstellung * 60;
    $('#settings').addClass('hidden');
    starteSpiel();
}

function starteSpiel() {
    $('#countdown').removeClass('hidden');
    $('#memory').removeClass('hidden').addClass('grid');
    starteCountdown(zeitEinstellung);
    for (let i = 0; i < spielfeldgroesse; i++) {
        felder.push(i);
        felder.push(i);
    }

    let sortierteFelder = [];

    for (let i=0; i < (spielfeldgroesse * 2); i++) {
        let randomIndex = Math.floor(Math.random() * felder.length);
        sortierteFelder[i] = felder[randomIndex];
        felder.splice(randomIndex,1);
    }

    let karten = '';
    for (let i of sortierteFelder) {
        karten += `<div data-zahl="${i}" class="karte"></div>`;
    }

    memKlasse = 'mem' + spielfeldgroesse;
    $('#memory').addClass(memKlasse);
    $('#memory').empty().append(karten);
    $('#memory div').click(klickKarten);

}

function klickKarten() {
    spielAktiv = true;
    if (this.innerHTML !== '' || klickVerboten === true) {
        return;
    }

    this.classList.add('aufgedeckt');
    let memoryZahl = this.getAttribute('data-zahl');
    this.innerHTML = `<img src="img/karte_${memoryZahl}.jpg">`;

    let alleAufgedeckt = $('.aufgedeckt');
    if (alleAufgedeckt.length === 2) {
        alleAufgedeckt.removeClass('aufgedeckt');
        if (alleAufgedeckt[0].innerHTML === alleAufgedeckt[1].innerHTML) {
            alleAufgedeckt.addClass('gleiche');
            checkSpielende();
        } else {
            alleAufgedeckt.addClass('falsch');
            klickVerboten = true;
            setTimeout(closeKarte, 1000);
        }
    }

}

function closeKarte() {
    klickVerboten = false;
    $('.falsch').html('').removeClass('falsch');
}

function checkSpielende() {
    if ($('.gleiche').length === (spielfeldgroesse * 2)) {
        spielAktiv = false;
        spielEnde();
    }
}

function spielEnde() {
    clearInterval(countdown);
    $('#msg').removeClass('hidden');
}

function starteCountdown(duration) {
    let timer = duration, minutes, seconds;
    countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        document.querySelector('#timer').textContent = minutes + ":" + seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (--timer < 0) {
            timer = duration;
            spielEnde()
        }
    }, 1000);
}

$('#getsettings').click(getsettings);
$('#neuesspiel').click(spielAufbau);
