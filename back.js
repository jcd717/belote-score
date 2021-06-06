/*
structure d'un score
====================

il est stocké dans un tableau de score -> let scores de la calsse Score

LE dictionnaire d'un score:
---------------------------
prisPar: EuxOuNous.EUX ou EuxOuNous.NOUS
capot: EuxOuNous.EUX ou EuxOuNous.NOUS ou null
score: entier ou null si capot
belote: EuxOuNous.EUX ou EuxOuNous.NOUS ou null

REM:
* les belotes sont imprenables même en cas de litige avec les belotes pour le preneur
Dans ce cas: 20 pour le preneur, 80 pour la défense, 81 en jeu
* capot+dedans=250

*/

"use strict";


let litigesEnCours = 0;


// une Enum en JS -> c'est une possibilité pratique qui permet d'ajouter des attributs en mettant un dict à la place de EuxOuNous.EUX
export let EuxOuNous = { EUX: "Eux", NOUS: "Nous" };
Object.freeze(EuxOuNous);

export class Score {
    /**
     * @param  {EuxOuNous!} prisPar // jamais null
     * @param  {EuxOuNous?} capot // null autorisé
     * @param  {number?} score // null autorisé si capot not null
     * @param  {EuxOuNous?} belote // null autorisé
     */
    constructor(prisPar, capot, score, belote) {
        // validations
        if (prisPar == null) throw new Error("Paramètre prisPar: L'équipe qui prend ne peut pas être null");
        else this.validateEuxOuNous('prisPar', prisPar);
        if (capot != null) this.validateEuxOuNous('capot', capot);
        if ((capot == null) && (score == null)) throw new Error("capot et score ne peuvent pas être null simultanément");
        if ((capot != null) && (score != null)) throw new Error("Le score doit être null s'il y a capot");
        // if(capot!=null) -> le score est donc non null et est un entier positif par validation du navigateur
        if (belote != null) this.validateEuxOuNous('belote', belote);

        this.prisPar = prisPar;
        this.capot = capot;
        this.score = score;
        this.belote = belote;
    }

    validateEuxOuNous(nom, valeur) {
        let ok = false;
        for (const [key, value] of Object.entries(EuxOuNous)) {
            if (valeur == value) {
                ok = true;
                break;
            }
        }
        if (!ok) throw new Error(nom + ': ' + JSON.stringify(valeur) + " n'est pas de type EuxOuNous");
    }

}

class ScoresSingleton {
    constructor() {
        if (!ScoresSingleton.instance) {
            ScoresSingleton.instance = this;
        }
        // Initialize object
        this.scores = [];
        return ScoresSingleton.instance;
    }
    // Properties & Methods
    get length() {
        return this.scores.length;
    }
    get(i) {
        return this.scores[i];
    }
    set(i, score) {
        this.scores[i] = score;
    }
    clear() {
        this.scores = [];
    }
    push(score) {
        this.scores.push(score);
    }
    pop() {
        this.scores.pop();
    }
    [Symbol.iterator]() { return this.scores.values(); }
    setToLocalStorage() {
        localStorage.setItem('scores', JSON.stringify(this.scores));
    }
    getFromLocalStorage() {
        this.scores = JSON.parse(localStorage.getItem('scores'));
        if(this.scores==null) this.scores=[];
    }
}
export const scores = new ScoresSingleton();


//export // pour debug
function calculerScore(score) {
    // retourne un dictionnaire {Eux,Nous}
    let sommes = {};
    sommes[EuxOuNous.EUX] = sommes[EuxOuNous.NOUS] = 0;
    const pasPris = (score.prisPar == EuxOuNous.EUX) ? EuxOuNous.NOUS : EuxOuNous.EUX;
    let litige = false;
    if (score.belote != null) {
        sommes[score.belote] += 20;
    }
    if (score.capot != null) {
        if (score.capot == score.prisPar) {
            sommes[score.prisPar] += 252;
        }
        else {
            sommes[pasPris] += 252;
        }
    }
    else {
        let complement = 162 - score.score;
        sommes[score.prisPar] += score.score;
        sommes[pasPris] += complement;
        if (sommes[score.prisPar] == sommes[pasPris]) { // litige
            litige = true;
            if(score.belote==null) {
                litigesEnCours += 81;
                sommes[score.prisPar] = 0;
                sommes[pasPris] = 81;
            }
            else if (score.belote == score.prisPar) {
                litigesEnCours += 81;
                sommes[score.prisPar] = 20;
                sommes[pasPris] = 91;
            }
            else { // 91 partout belotes pour la défense
                litigesEnCours += 91;
                sommes[score.prisPar] = 0;
                sommes[pasPris] = 91;
            }
        }
        else if (sommes[score.prisPar] < sommes[pasPris]) { // dedans
            sommes[score.prisPar] -= score.score; // garde éventuellement les belotes
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

export function calculerScores() {
    litigesEnCours=0;
    let resultat = {
        isEnteteDetailsPresent: scores.length != 0,
        is500atteind: false,
        totaux: {},
        detailScore: [], // dictionnaires de {eux,nous}
    };
    resultat.totaux[EuxOuNous.EUX] = resultat.totaux[EuxOuNous.NOUS] = 0;

    for (const score of scores) {
        const s = calculerScore(score);
        resultat.detailScore.push(s);
        let pasEncore500=false;
        if(score==scores.get(scores.length-1)) {
            if ((resultat.totaux[EuxOuNous.EUX] < 500) && (resultat.totaux[EuxOuNous.NOUS]<500)) pasEncore500=true;
        }
        resultat.totaux[EuxOuNous.EUX] += s[EuxOuNous.EUX];
        resultat.totaux[EuxOuNous.NOUS] += s[EuxOuNous.NOUS];
        if(score == scores.get(scores.length - 1)&&(pasEncore500)) {
            if ((resultat.totaux[EuxOuNous.EUX] >= 500) || (resultat.totaux[EuxOuNous.NOUS] >= 500)) resultat.is500atteind=true;
        }
    }
    return resultat;
}

