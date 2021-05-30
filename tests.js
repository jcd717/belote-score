
"use strict";

import { scores, EuxOuNous, Score, calculerScores /* debug: */, calculerScore } from './back.js';

export function onLoad() {

    // scores de test
    const testScores = [
        { prisPar: EuxOuNous.EUX, capot: null, score: 150, belote: null },
        { prisPar: EuxOuNous.NOUS, capot: null, score: 90, belote: null },
        { prisPar: EuxOuNous.NOUS, capot: null, score: 0, belote: null }, // une levée à zéro
        { prisPar: EuxOuNous.NOUS, capot: EuxOuNous.NOUS, score: null, belote: EuxOuNous.NOUS },
        { prisPar: EuxOuNous.EUX, capot: EuxOuNous.EUX, score: null, belote: EuxOuNous.NOUS },
        { prisPar: EuxOuNous.NOUS, capot: EuxOuNous.NOUS, score: null, belote: EuxOuNous.EUX },
        { prisPar: EuxOuNous.EUX, capot: EuxOuNous.NOUS, score: null, belote: null },
        { prisPar: EuxOuNous.NOUS, capot: null, score: 96, belote: null }, // score en 6
        { prisPar: EuxOuNous.NOUS, capot: null, score: 70, belote: EuxOuNous.NOUS }, // DEDANS
        { prisPar: EuxOuNous.NOUS, capot: null, score: 32, belote: null }, // DEDANS
        { prisPar: EuxOuNous.NOUS, capot: null, score: 82, belote: EuxOuNous.EUX }, // DEDANS
        { prisPar: EuxOuNous.NOUS, capot: null, score: 95, belote: null }, //score en 5
        { prisPar: EuxOuNous.NOUS, capot: null, score: 84, belote: null }, //score en 4
        { prisPar: EuxOuNous.NOUS, capot: null, score: 82, belote: null }, //juste
        { prisPar: EuxOuNous.NOUS, capot: null, score: 91, belote: EuxOuNous.EUX }, //litige
        { prisPar: EuxOuNous.NOUS, capot: null, score: 80, belote: null }, //DEDANS
        { prisPar: EuxOuNous.NOUS, capot: null, score: 91, belote: EuxOuNous.EUX }, //litige
        { prisPar: EuxOuNous.EUX, capot: null, score: 81, belote: null }, //litige
        { prisPar: EuxOuNous.NOUS, capot: null, score: 84, belote: null }, //PAS dedans
        { prisPar: EuxOuNous.NOUS, capot: null, score: 122, belote: null }, // normal
        { prisPar: EuxOuNous.NOUS, capot: null, score: 81, belote: null }, //litige
        { prisPar: EuxOuNous.NOUS, capot: EuxOuNous.NOUS, score: null, belote: EuxOuNous.NOUS },

        { prisPar: EuxOuNous.NOUS, capot: null, score: 102, belote: EuxOuNous.EUX }, // normal avec belote
        { prisPar: EuxOuNous.EUX, capot: EuxOuNous.NOUS, score: null, belote: EuxOuNous.NOUS }, //capot+dedans
    ];
    // let testScoresByClass = [];
    let i=0;
    for (const s of testScores) {
        scores.push(new Score(s.prisPar, s.capot, s.score, s.belote));
        let saisie=scores.get(i);
        addConsole(JSON.stringify(saisie));
        addConsole("score= " + JSON.stringify(calculerScore(saisie)));
        let totaux = calculerScores().totaux;
        addConsole("totaux= "+JSON.stringify(totaux));
        i++;
    }
    // scores.setToLocalStorage();
    // scores.getFromLocalStorage();
    // for (const s of scores) {
    //     addConsole(JSON.stringify(s));
    //     addConsole("score= " +JSON.stringify(calculerScore(s)));
    //     let totaux=calculerScores();
    //     addConsole("totaux= ")+JSON.stringify(totaux);
    // }

}

function addConsole(s) {
    document.getElementById('console').innerHTML += `${s}\n`;
}


// export let sound500TXT;
// async function loadSound500() {
//     try {
//         const response = await fetch('./500.mp3.txt');
//         const data = await response.text();
//         sound500TXT=data;
//     } catch (err) {
//         console.error(err);
//     }
// }
// loadSound500();
// console.log(sound500TXT);

// let sound500 = new Audio('data:audio/ogg;base64,'+sound500TXT);

export let sound500=new Audio('./500.mp3')
// sound500.volume=0;
// sound500.play();
// sound500.volume=1;

export function play500() {
    // console.log('play')
    sound500.play();
}