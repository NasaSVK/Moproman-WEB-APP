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
    console.log("POVODNE POLE: " + pPole);
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


export var DodajSpotrebu = (pRecords) => {

    var t0 = new Date();
    var u0 = 0, i0 = 0;
    //VYPCET VYKONU
    for (let i = 0; i < pRecords.length; i++) {

        let du = Math.abs(pRecords[i].napatie);
        let di = Math.abs(pRecords[i].prud);

        pRecords[i].mojvykon = (du * di).toFixed(2);

        u0 = pRecords[i].napatie;
        i0 = pRecords[i].prud;
    }

    //VYPOCET SPOTREBY
    for (let i = 0; i < pRecords.length; i++) {

        if (i == 0) {
            pRecords[i].spotreba = 0;
            t0 = new Date(pRecords[i].dateTime);
            //console.log("t0:{0}",pRecords[i].dateTime);
            u0 = pRecords[i].napatie;
            i0 = pRecords[i].prud;
        }
        else {
            let dt = new Date(pRecords[i].dateTime) - t0;
            let du = Math.abs(pRecords[i].napatie + u0) / 2;
            let di = Math.abs(pRecords[i].prud + i0) / 2;
            //pRecords[i].spotreba = parseFloat((du*di*dt/1000).toFixed(2));
            //pRecords[i].spotreba = Math.round(du * di * dt / 10) / 100;
            pRecords[i].spotreba = du * di * dt / 1000;
            //pRecords[i].spotreba = ((du*di*dt/1000).toFixed(2));

            //console.log((pRecords[i].spotreba));
            //console.log("SPOTREBA:{0},{1},{2},{3} \n",pRecords[i].spotreba,du,di,dt);

            t0 = new Date(pRecords[i].dateTime);
            u0 = pRecords[i].napatie;
            i0 = pRecords[i].prud;
        }
    }

}
