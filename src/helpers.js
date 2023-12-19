import moment from 'moment';

const DELTA = 5000; //[ms] predpokladany casovy interval medzi dvomi meraniami

export function ZobrazPec(pPec) {

        let result = {};
        switch (pPec) {
                case ("PEC_A"): result = { frekvencia: true, mojVykon: false, DBVykon: false, okamzitaSpotreba: false, spotrebaZmien: false, napatie: false, prud: false, tlak: false, sobertVstup: false, sobertVykon: false, rzPrisposobenie: false, prietok: false, teplotaVstup: true, teplotaP1: false, teplotaP2: false, teplotaOkruh: false }; break;
                case ("PEC_B"): result = { frekvencia: false, mojVykon: true, DBVykon: true, okamzitaSpotreba: true, spotrebaZmien: true, napatie: true, prud: true, tlak: true, sobertVstup: true, sobertVykon: true, rzPrisposobenie: true, prietok: false, teplotaVstup: true, teplotaP1: false, teplotaP2: false, teplotaOkruh: false }; break;
                case ("PEC_C"): result = { frekvencia: false, mojVykon: true, DBVykon: true, okamzitaSpotreba: true, spotrebaZmien: true, napatie: true, prud: true, tlak: true, sobertVstup: true, sobertVykon: true, rzPrisposobenie: true, prietok: false, teplotaVstup: true, teplotaP1: true, teplotaP2: true, teplotaOkruh: false }; break;
                case ("PEC_D"): result = { frekvencia: false, mojVykon: true, DBVykon: true, okamzitaSpotreba: true, spotrebaZmien: true, napatie: true, prud: true, tlak: true, sobertVstup: true, sobertVykon: true, rzPrisposobenie: true, prietok: false, teplotaVstup: true, teplotaP1: true, teplotaP2: true, teplotaOkruh: false }; break;
                case ("PEC_G"): result = { frekvencia: false, mojVykon: true, DBVykon: true, okamzitaSpotreba: true, spotrebaZmien: true, napatie: true, prud: true, tlak: false, sobertVstup: true, sobertVykon: true, rzPrisposobenie: true, prietok: true, teplotaVstup: true, teplotaP1: true, teplotaP2: true, teplotaOkruh: false }; break;
                case ("PEC_H"): result = { frekvencia: true, mojVykon: true, DBVykon: true, okamzitaSpotreba: true, spotrebaZmien: true, napatie: true, prud: true, tlak: false, sobertVstup: false, sobertVykon: false, rzPrisposobenie: true, prietok: true, teplotaVstup: true, teplotaP1: true, teplotaP2: true, teplotaOkruh: true }; break;
        }

        return result
}

//vytvori pol so zaciatkami vsetkych ZMIEN v ZADANOM INTERVALE <pOD, pDO>
export function dajZaciatkyZmien(pOD, pDO) {

        let ZMENY_ARR = [];
        let firstDate = new Date(moment(pOD).format("YYYY-MM-DDT06:00:00"));
        if (pOD > firstDate) firstDate = new Date(moment(pOD).format("YYYY-MM-DDT14:00:00"))
        if (pOD > firstDate) firstDate = new Date(moment(pOD).format("YYYY-MM-DDT22:00:00"));
        if (pOD > firstDate) firstDate = new Date(moment(moment(pOD).add(1, 'days')).format("YYYY-MM-DDT06:00:00"));
        //console.log("pOD:{0}", pOD); console.log("firstDate:{0}", firstDate);

        let pomDate = firstDate;
        let index = 0;
        //console.log('pomDate: {0}', firstDate);        
        while (pomDate < pDO) {
                //console.log('pomDate{0}', pomDate);
                ZMENY_ARR.push(pomDate);
                pomDate = moment(pomDate).add(480, 'minutes');
                index++;
        }
        //console.log('ZMENY_ARR:', ZMENY_ARR);
        return ZMENY_ARR;
}

export function WeekBack(pDatum) {

        let date = new Date();
        date.setDate(pDatum.getDate() - 7);
        date.setSeconds(0); date.setMinutes(0); date.setHours(0);
        console.log("DATUM:" + date);
        return date;
}


export function MonthBack(pDatum) {

        let date = new Date();
        date.setDate(pDatum.getDate() - 30);
        //date.setSeconds(0).setMinutes(0).setHours(0);
        return date;
}


export var RedukujPocetHodnot = (pPole, pMinPocet = 100) => {
        //console.log("POVODNE POLE: " + pPole);
        var dlzka = pPole.length; if (dlzka == 0) return [];
        var MAX_INDEX = dlzka - 1;
        var PER = Math.floor(dlzka / pMinPocet);
        if (PER == 0) PER = 1;
        var result = [];
        pPole.map((hodnota, index) => {
                if (index % PER == 0)
                        result.push(hodnota);
        });
        //console.log("REDUKOVANE POLE: "+ result);
        if (MAX_INDEX % PER != 0)
                result.push(pPole[MAX_INDEX]); //vlozi do redukovaneho pola posledny prvok pola povodneho
        //console.log("FINALNE POLE: "+ result);
        //console.log("POCET PRVKOV: "+ result.length);
        return result;
}

export var DajSpotrebu = (pNapatie, pPrud, pCas) => {

        var SPOTREBA = [];

        for (let i = 0; i < pCas.length - 1; i++) {
                let t1 = pCas[i];
                let t2 = pCas[i + 1];
                let DELTA = Math.abs(t2 - t1);
                SPOTREBA.push(DELTA * pNapatie[i] * pPrud[i]);
        }

        return SPOTREBA;
}


export var DodajKrajneHodnoty = (pCasDolny, pCasHorny) => {
        pCasDolny.setMinutes(0);
        pCasDolny.setSeconds(0);

        pCasHorny.setHours(pCasHorny.getHours() + 1);
        pCasHorny.setMinutes(0);
        pCasHorny.setSeconds(0);

        return { minTime: pCasDolny, maxTime: pCasHorny }
}
