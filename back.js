/*
structure d'un score
====================

il est stocké dans un tableau de score -> let scores accesibles via setScores(), pushScores() & getScores()

LE dictionnaire d'un score:
---------------------------
prisPar: EuxOuNous.EUX ou EuxOuNous.NOUS
capot: EuxOuNous.EUX ou EuxOuNous.NOUS ou null
score: entier ou null si capot
belote: EuxOuNous.EUX ou EuxOuNous.NOUS ou null

REM:
* les belotes sont imprenables
* capot+dedans=250

*/

"use strict";


let litigesEnCours;


// une Enum en JS -> c'est une possibilité pratique qui permet d'ajouter des attributs en mettant un dict à la place de EuxOuNous.EUX
export let EuxOuNous = { EUX: "Eux", NOUS: "Nous" };
Object.freeze(EuxOuNous);

export class Score {
    /**
     * @param  {!EuxOuNous} prisPar // jamais null
     * @param  {?EuxOuNous} capot // null autorisé
     * @param  {?number} score // null autorisé si capot not null
     * @param  {?EuxOuNous} belote // null autorisé
     */
    constructor(prisPar, capot, score, belote) {
        // validations
        if (prisPar == null) throw new Error("Paramètre prisPar: L'équipe qui prend ne peut pas être null");
        else this.validateEuxOuNous('prisPar', prisPar);
        if (capot != null) this.validateEuxOuNous('capot', capot);
        if ((capot == null) && (score == null)) throw new Error("capot et score ne peuvent pas être null simultanément");
        if ((capot != null) && (score != null)) throw new Error("Le score doit être null s'il y a capot");
        // if(capot==null) -> le score est donc non null et est un entier positif par validation du navigateur
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
        this.scores=[];
        return ScoresSingleton.instance;
    }
    // Properties & Methods
    length() {
        return this.scores.length;
    }
    get(i) {
        return this.scores[i];
    }
    set(i,score) {
        this.scores[i]=score;
    }
    clear() {
        this.scores=[];
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
    }
}
export const scores = new ScoresSingleton();


export // pour debug
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

export function calculerScores() {
    let resultat = {
        isEnteteDetailsPresent: scores.length != 0,
        totaux: {},
        detailScore: [], // dictionnaires de {eux,nous}
    };
    resultat.totaux[EuxOuNous.EUX]=resultat.totaux[EuxOuNous.NOUS]=0;

    for (const score of scores) {
        let s = calculerScore(score);
        resultat.totaux[EuxOuNous.EUX] += s[EuxOuNous.EUX];
        resultat.totaux[EuxOuNous.NOUS] += s[EuxOuNous.NOUS];
        let ajout={};
        ajout[EuxOuNous.EUX] = s[EuxOuNous.EUX];
        ajout[EuxOuNous.NOUS] = s[EuxOuNous.NOUS];
        resultat.detailScore.push(ajout);
    }
    return resultat;
}

