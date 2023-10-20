export const name = "square";

export function WeekBack(pDatum) {
  
    let date = new Date();
    date.setDate(pDatum.getDate()-7);
    date.setSeconds(0);date.setMinutes(0);date.setHours(0);
    console.log("DATUM:" + date);
    return date; 
}


export function MonthBack(pDatum) {
  
    let date = new Date();
    date.setDate(pDatum.getDate()-30);
    //date.setSeconds(0).setMinutes(0).setHours(0);
    return date; 
}


export var RedukujPocetHodnot = (pPole,pMinPocet = 100)=>{
    console.log("POVODNE POLE: "+ pPole);
 var dlzka = pPole.length; if (dlzka == 0) return [];
 var MAX_INDEX = dlzka -1;
 const PER = Math.floor(dlzka / pMinPocet);
 if (PER == 0) PER = 1;
 var result = [];
 pPole.map ((hodnota, index) => 
    {if(index%PER == 0)
        result.push(hodnota);
});

console.log("REDUKOVANE POLE: "+ result);

if (MAX_INDEX%PER != 0)
    result.push(pPole[MAX_INDEX]); //vlozi do redukovaneho pola posledny prvok pola povodneho
    console.log("FINALNE POLE: "+ result);
    console.log("POCET PRVKOV: "+ result.length);   
    return result;
}

export var DajSpotrebu = (pNapatie,pPrud,pCas)=>{
    
    var SPOTREBA = [];
    
    for(let i = 0; i < pCas.length-1; i++){
        let t1 = pCas[i];
        let t2 = pCas[i+1];
        let DELTA = Math.abs(t2-t1);
        SPOTREBA.push(DELTA*pNapatie[i]*pPrud[i]);
    }
    
    return SPOTREBA;
}

export var DodajSpotrebu = (pRecords)=>{
    
    var t0 = new Date();
    
    for(let i = 0;i<pRecords; i++){
        if(i == 0) {
            pRecords[i].vykon = 0;
            t0 = pRecords[i].date_time;
            u0 = pRecords[i].napatie;
            i0 = pRecords[i].prud;
        }
        else
        {
            let dt = pRecords[i].date_time - t0;
            let du = (pRecords[i].napatie - u0)/2;
            let di = (pRecords[i].prud - i0)/2;
            
            pRecords[i].vykon = du*di*dt;

            d0 = pRecords[i].date_time;
            d0 = pRecords[i].napatie;
            d0 = pRecords[i].prud;
        }
    }   
}
