/*
structure d'un score
====================

il est stocké dans un tableau de score -> let scores

LE dictionnaire d'un score:
---------------------------
prisPar: "eux" ou "nous"
capot: "eux" ou "nous" ou null
score: entier ou null si capot
belote: "eux" ou "nous" ou null

REM: 
* les belotes sont imprenables
* capot+dedans=250

*/

"use strict";

// pour que for( of ) fonctionne sur NodeList & HTMLCollection (pb avec mon iPhone 10.3.3)
/*
cf https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements
This works because it attaches the Array iterator to both the NodeList and HTMLCollection prototypes 
so that when for/of iterates them, it uses the Array iterator to iterate them.
*/
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];


let scores;
let litigesEnCours;
let charRemove;
let charEdit;

function onLoad() {

    // scores de test
    const testScores = [
        // { prisPar: "eux", capot: false, score: 150, belote: null },
        // { prisPar: "nous", capot: false, score: 90, belote: null },
        // { prisPar: "nous", capot: true, score: null, belote: "nous" },
        { prisPar: "eux", capot: true, score: null, belote: "nous" },
        // { prisPar: "nous", capot: true, score: null, belote: "eux" },
        // { prisPar: "eux", capot: true, score: null, belote: null },
        // { prisPar: "nous", capot: false, score: 96, belote: null }, // score en 6
        // { prisPar: "nous", capot: false, score: 70, belote: "nous" }, // DEDANS
        // { prisPar: "nous", capot: false, score: 32, belote: null }, // DEDANS
        // { prisPar: "nous", capot: false, score: 82, belote: "eux" }, // DEDANS
        // { prisPar: "nous", capot: false, score: 95, belote: null }, //score en 5
        // { prisPar: "nous", capot: false, score: 84, belote: null }, //score en 4
        { prisPar: "nous", capot: false, score: 82, belote: null }, //juste
        { prisPar: "nous", capot: false, score: 91, belote: "eux" }, //litige
        { prisPar: "nous", capot: false, score: 80, belote: null }, //DEDANS
        { prisPar: "nous", capot: false, score: 91, belote: "eux" }, //litige
        { prisPar: "eux", capot: false, score: 81, belote: null }, //litige
        { prisPar: "nous", capot: false, score: 84, belote: null }, //PAS dedans
        { prisPar: "nous", capot: false, score: 122, belote: false }, // normal
        { prisPar: "nous", capot: false, score: 81, belote: null }, //litige
        { prisPar: "nous", capot: true, score: null, belote: "nous" },

        // { prisPar: "nous", capot: false, score: 102, belote: "eux" }, // normal avec belote
    ];

    charEdit = document.getElementById("charEdit").innerText;
    charRemove = document.getElementById("charRemove").innerText;
    litigesEnCours = 0;
    scores = JSON.parse(localStorage.getItem('scores'));
    if (scores == null) {
        // scores=[];
        // pour test, la bonne valeur est au dessus
        scores = testScores;
        // localStorage.setItem('scores', JSON.stringify(scores));
    }
    resetPopupSaisie();
    afficherScores();
}

function insertScore(prisPar, capot, score, belote) {
    scores[scores.length] = {
        prisPar: prisPar,
        capot: capot,
        score: score,
        belote: belote
    };
    localStorage.setItem('scores', JSON.stringify(scores));
}

function deleteScore() {
    scores.pop();
    localStorage.setItem('scores', JSON.stringify(scores));
}

function truncateScores() {
    scores = [];
    localStorage.setItem('scores', JSON.stringify(scores));
}

function updateScore(index, prisPar, capot, score, belote) {
    scores[index] = {
        prisPar: prisPar,
        capot: capot,
        score: score,
        belote: belote
    };
    localStorage.setItem('scores', JSON.stringify(scores));
}

function modifier(index) {
    //alert("Modifier! \"" + index + '"');
    remplirPopupSaisie(scores[index]);

}

function supprimer() {
    const ok = confirm("ATTENTION !!!\nVous allez supprimer ce score !!!");
    if (!ok) return;
    deleteScore();
    afficherScores();
}

function calculerScores() {
    let resultat = {
        isEnteteDetailsPresent: scores.length != 0,
        totaux: { "eux": 0, "nous": 0 },
        detailScore: [], // dictionnaires de {eux,nous}
    };
    for (const score of scores) {
        // console.log(score); //debug
        s = calculerScore(score);
        resultat.totaux.eux += s.eux;
        resultat.totaux.nous += s.nous;
        resultat.detailScore.push({ eux: s.eux, nous: s.nous });
    }
    return resultat;
}

function afficherScores() {
    const resultat = calculerScores();
    document.getElementById('scores').innerHTML = '<td>' + resultat.totaux.eux + '</td><td>' + resultat.totaux.nous + '</td>';
    if (resultat.isEnteteDetailsPresent) {
        let details = '';
        // for (let i = resultat.detailScore.length - 1; i >= 0; i--) { // Affichage antichronologique
        for (let i = 0; i < resultat.detailScore.length; i++) {
            details += '\
            <tr> \
                <td>'+ resultat.detailScore[i].eux + '</td>\
                <td>'+ resultat.detailScore[i].nous + '</td>\
                <td '+ (
                    (i == resultat.detailScore.length - 1) ?
                        'onclick="supprimer();">' + charRemove :
                        'class="blinking" onclick="modifier(' + i + ');">' + charEdit
                ) + '</td>\
            </tr>';
        }
        document.getElementById('details').innerHTML = details;
    }
    else {
        if (document.getElementById('entete-details') != null) {
            document.getElementById('entete-details').remove();
        }
        document.getElementById('details').innerHTML = '<tr style="visibility: collapse;"><td></td><td></td><td></td></tr>';
    }
    document.getElementById('reset').style.visibility = (resultat.isEnteteDetailsPresent) ? 'visible' : 'hidden';

}

function calculerScore(score) {
    // retourne un dictionnaire {eux,nous}
    let sommes = { "eux": 0, "nous": 0 };
    const pasPris = (score.prisPar == "eux") ? "nous" : "eux";
    let litige = false;
    if (score.belote != null) {
        sommes[score.belote] += 20;
    }
    if (score.capot) {
        sommes[score.prisPar] += 252;
    }
    else {
        let complement = 162 - score.score;
        sommes[score.prisPar] += score.score;
        sommes[pasPris] += complement;
        if (sommes[score.prisPar] == sommes[pasPris]) { // litige
            litigesEnCours += sommes[score.prisPar];
            sommes[score.prisPar] -= score.score;
            litige = true;
        }
        else if (sommes[score.prisPar] < sommes[pasPris]) { // dedans
            sommes[score.prisPar] -= score.score;
            sommes[pasPris] += score.score;
        }
    }
    if ((!litige) && (sommes[score.prisPar] != sommes[pasPris])) {
        if (sommes[score.prisPar] > sommes[pasPris]) {
            sommes[score.prisPar] += litigesEnCours;
        }
        else {
            sommes[pasPris] += litigesEnCours;
        }
        litigesEnCours = 0;
    }
    //arrondis
    sommes[score.prisPar] = arrondir(sommes[score.prisPar]);
    sommes[pasPris] = arrondir(sommes[pasPris]);
    return sommes;
}

function arrondir(x) {
    return 10 * Math.round((x - 0.1) / 10);
}

function reset() {
    if (scores.length != 0) {
        const ok = confirm("ATTENTION !!!\nVous allez TOUT SUPPRIMER et mettre les scores à ZÉROS !!!");
        if (!ok) return;
    }
    truncateScores();
    afficherScores();
}

function recordSaisie() {

    resetPopupSaisie();
    return false;
}

function zeroOuUnCB(checkbox) {
    // une seule case cochée max
    document.getElementsByName(checkbox.name).forEach(
        (item) => { if (item !== checkbox) item.checked = false; }
    );
    // si capot, griser textScore
    if (checkbox.name == 'capotPour') {
        let uneCoche = false;
        document.getElementsByName(checkbox.name).forEach( // je me fais plaisir car il vaudrait mieux un for classique pour bénéficier du break 
            (item) => { if (item.checked) uneCoche = true; }
        );
        if(uneCoche) griserTextScore();
        else degriserTextScore();
    }
}

function resetPopupSaisie() {
    for (const i of document.getElementById("popupSaisie").getElementsByTagName('input')) {
        if (i.type == 'checkbox') i.checked = false;
        else if (i.type == 'number') {
            i.value = '';
            i.disabled = false;
        }
    }
    document.getElementById('labelTextScore').style.color = null;
}

function griserTextScore() {
    document.getElementById('textScore').disabled = true;
    document.getElementById('labelTextScore').style.color = "#CCC";
}

function degriserTextScore() {
    document.getElementById('textScore').disabled = false;
    document.getElementById('labelTextScore').style.color = null;
}

function remplirPopupSaisie(score) {
    document.getElementById('prisParEux').checked = score.prisPar == "eux";
    document.getElementById('prisParNous').checked = score.prisPar == "nous";
    if(score.capot) {
        griserTextScore();
        document.getElementById('capotPourEux').checked = score.prisPar == "eux"; // faux -> capot-dedans
        document.getElementById('prisParNous').checked = score.prisPar == "nous";
    }
}
