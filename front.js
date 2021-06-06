"use strict";


import { scores, EuxOuNous, Score, calculerScores } from './back.js';


// pour que for( of ) fonctionne sur NodeList & HTMLCollection (pb avec mon iPhone iOS 10.3.3)
/*
cf https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements
This works because it attaches the Array iterator to both the NodeList and HTMLCollection prototypes 
so that when for/of iterates them, it uses the Array iterator to iterate them.
*/
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];


let sound500 = new Audio('data:audio/mp3;base64,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VQpwOhUwAAATFYVESXPTAAAAAP/7YETuAAKEHVt+YeQQHEDKRMeAAAoYdW/5h4BAsojpYx5gAAABldhYZtGZF4nfflHBTUsDQlQuyEdWaqizRXrwEMuwQUATSqFzVhc0yj10JMKQnFwvowv5LgukLclCXYmiV3+IUr5/0JJ0xi0gqS1OAAAD+iRKzQUjppEjjAwUSYMBCni5Av/ibFN87g1MQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7YETpAAJ1HVz+YeAQLQLqW8egAEzYdVm5rAAAAAA/wwAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QEToAAKvHVv+YeCQAAANIMAAAAREL0+8YQAoAAA0g4AABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');

function play500() {
    if (!onLoading) sound500.play();
}

let charRemove;
let charEdit;
let onLoading=false;

window.onLoad = onLoad;
export function onLoad() {
    onLoading=true;
    charEdit = document.getElementById("charEdit").innerText;
    charRemove = document.getElementById("charRemove").innerText;

    // //scores de test
    // const testScores = [
    //     { prisPar: EuxOuNous.EUX, capot: null, score: 150, belote: null },
    //     { prisPar: EuxOuNous.NOUS, capot: null, score: 90, belote: null },
    // ];
    // for (const s of testScores) {
    //     scores.push(new Score(s.prisPar, s.capot, s.score, s.belote));
    // }

    scores.getFromLocalStorage();
    if (scores.length == 0) {
        scores.setToLocalStorage();
    }
    resetPopupSaisie();
    afficherScores();
    onLoading=false;
}

function resetPopupSaisie() {
    for (const i of document.getElementById("popupSaisie").getElementsByTagName('input')) {
        if (i.type == 'checkbox') i.checked = false;
        else if (i.type == 'number') {
            i.value = '';
            i.disabled = false;
        }
    }
    degriserTextScore();
    document.getElementById('labelTextScore').style.color = null;
}

function afficherScores() {
    const resultat = calculerScores();
    document.getElementById('scores').innerHTML = '<td>' + resultat.totaux[EuxOuNous.EUX] + '</td><td>' + resultat.totaux[EuxOuNous.NOUS] + '</td>';
    if (resultat.isEnteteDetailsPresent) {
        document.getElementById('details').style.visibility=document.getElementById('entete-details').style.visibility = 'visible';
        let details = '';
        for (let i = resultat.detailScore.length - 1; i >= 0; i--) { // Affichage antichronologique
        // for (let i = 0; i < resultat.detailScore.length; i++) {
            details += '\
            <tr id="detail'+i+'"> \
                <td>'+ resultat.detailScore[i][EuxOuNous.EUX] + '</td>\
                <td>'+ resultat.detailScore[i][EuxOuNous.NOUS] + '</td>\
                <td '+ (
                    (i == resultat.detailScore.length - 1) ?
                        //'onclick="supprimer();">' + charRemove :
                        `><span onclick="modifier(${i});">${charEdit}  </span><span onclick="supprimer();">${charRemove}</span>` :
                        'class="blinking" onclick="modifier(' + i + ');" style="text-align: left;">' + charEdit
                ) + '</td>\
            </tr>';
        }
        document.getElementById('details').innerHTML = details;
    }
    else {
        if (document.getElementById('entete-details') != null) {
            // document.getElementById('entete-details').remove();
            document.getElementById('entete-details').style.visibility = 'collapse';
        }
        // document.getElementById('details').innerHTML = '<tr style="visibility: collapse;"><td></td><td></td><td></td></tr>';
        document.getElementById('details').style.visibility = 'collapse';
    }
    document.getElementById('reset').style.visibility = (resultat.isEnteteDetailsPresent) ? 'visible' : 'hidden';

    if (resultat.is500atteind) play500();
}

window.reset = reset;
export function reset() {
    if (scores.length != 0) {
        const ok = confirm("ATTENTION !!!\nVous allez TOUT SUPPRIMER et mettre les scores à ZÉROS !!!");
        if (!ok) return;
    }
    truncateScores();
    afficherScores();
}

function truncateScores() {
    scores.clear();
    scores.setToLocalStorage();
}

function insertScore(prisPar, capot, score, belote) {
    scores.push(new Score(prisPar, capot, score, belote));
    scores.setToLocalStorage();
}

function deleteScore() {
    scores.pop();
    scores.setToLocalStorage();
}

function updateScore(index, prisPar, capot, score, belote) {
    scores.set(index, new Score(prisPar, capot, score, belote));
    scores.setToLocalStorage();
}

window.supprimer = supprimer;
export function supprimer() {
    const ok = confirm("ATTENTION !!!\nVous allez supprimer ce score !!!");
    if (!ok) return;
    deleteScore();
    afficherScores();
}

window.zeroOuUnCB = zeroOuUnCB;
export function zeroOuUnCB(checkbox) {
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
        if (uneCoche) griserTextScore();
        else degriserTextScore();
    }
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
    resetPopupSaisie();
    document.getElementById('prisParEux').checked = score.prisPar == EuxOuNous.EUX;
    document.getElementById('prisParNous').checked = score.prisPar == EuxOuNous.NOUS;
    if (score.capot!=null) {
        griserTextScore();
        document.getElementById('capotPourEux').checked = score.capot == EuxOuNous.EUX;
        document.getElementById('capotPourNous').checked = score.capot == EuxOuNous.NOUS;
    }
    else {
        document.getElementById('textScore').value=score.score;
    }
    if(score.belote!=null) {
        document.getElementById('belotePourEux').checked = score.belote == EuxOuNous.EUX;
        document.getElementById('belotePourNous').checked = score.belote == EuxOuNous.NOUS;
    }
}

window.modifier = modifier;
export function modifier(index) {
    remplirPopupSaisie(scores.get(index));
    document.getElementById('saisieIndex').value = index;
    document.querySelector('#popupSaisie  .titrePopup').innerHTML = "Score "+(index+1);
    // let rect = document.getElementById('detail'+index).getBoundingClientRect();
    let rect = document.getElementById('scores').getBoundingClientRect();
    document.getElementById('popupSaisie').style.paddingTop = rect.top + rect.height + 'px';
    document.getElementById('popupSaisie').style.display = 'block';
}

window.recordSaisie=recordSaisie;
export function recordSaisie() {
    let index = document.getElementById('saisieIndex').value;
    let belote=null;
    if (document.getElementById('belotePourEux').checked) belote=EuxOuNous.EUX
    else if (document.getElementById('belotePourNous').checked) belote = EuxOuNous.NOUS
    let capot=null;
    if (document.getElementById('capotPourEux').checked) capot = EuxOuNous.EUX
    else if (document.getElementById('capotPourNous').checked) capot = EuxOuNous.NOUS
    let prisPar = (document.getElementById('prisParEux').checked)? EuxOuNous.EUX : EuxOuNous.NOUS;
    let score=null;
    if (capot == null) score = parseInt(document.getElementById('textScore').value);
    score=new Score(prisPar,capot,score,belote);
    if(index==-1) scores.push(score);
    else scores.set(index,score);
    scores.setToLocalStorage();

    document.querySelector('#popupSaisie .buttonClosePopup').click();
    afficherScores();
    return false;
}

window.saisirNewScore = saisirNewScore;
export function saisirNewScore() {
    resetPopupSaisie();
    document.getElementById('saisieIndex').value=-1;
    document.querySelector('#popupSaisie  .titrePopup').innerHTML="Le SCORE";
    let rect=document.getElementById('scores').getBoundingClientRect();
    document.getElementById('popupSaisie').style.paddingTop=rect.top+rect.height+'px';
    document.getElementById('popupSaisie').style.display = 'block';
}

window.closePopup = closePopup;
export function closePopup(event) {
    event.parentNode.parentNode.parentNode.style.display=null;
}
