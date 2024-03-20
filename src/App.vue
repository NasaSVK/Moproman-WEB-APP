<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
import Modal from './components/Modal.vue'
import EMT from './main.js'
import xlsx from 'xlsx/dist/xlsx.full.min'

</script>
<template>
   <Modal :pChartData=myModalData :pChartOptions=myModalOptions></Modal>

   <form class="sticky-top bg-gray-200 bg-gradient border-bottom border-2">
      <div class="container-fluid ps-0 pe-0 ps-sm-2 pe-sm-2 row">
         <fieldset class="col-auto mb-0 pe-2 ">
            <legend class="col-form-label pt-0 pb-0">Interval</legend>
            <div class="form-check">
               <input class="form-check-input" type="radio" id="rdbTzden" value="WEEK" v-model="picked">
               <label class="form-check-label" for="rdbTzden">
                  TÝŽDENNÝ
               </label>
            </div>
            <div class="form-check">
               <input class="form-check-input" type="radio" id="rdbMesiac" value="MONTH" v-model="picked">
               <label class="form-check-label" for="rdbMesiac">
                  MESAČNÝ
               </label>
            </div>
            <div class="form-check">
               <input class="form-check-input" type="radio" id="rdbCustom" value="CUSTOM" v-model="picked">
               <label class="form-check-label" for="rdbCustom">
                  VLASTNÝ
               </label>
            </div>
         </fieldset>

         <fieldset class="col-auto mb-0 mt-3 pe-0 ps-0">
            <label class="col-auto d-block mb-4 mt-2">Od</label>
            <label class="col-auto">Do</label>
         </fieldset>

         <fieldset class="col mb-0 ps-1 mt-3">
            <VueDatePicker :disabled="cp_disable_picker" id="dtpOD" class="picker mb-2" v-model="dpOD" :format="dateFormat"></VueDatePicker>
            <VueDatePicker :disabled="cp_disable_picker" id="dtpDO" class="picker mb-2" v-model="dpDO" :format="dateFormat"></VueDatePicker>
         </fieldset>

         <!-- align-self-end -->

         <div class="col-sm-auto ps-0 mt-sm-3">
            <div class="row mb-2">
               <label for="slZmena" class="col-2 col-sm-3 pe-0 col-form-label">Zmena</label>
               <div class="col pe-0">
                  <!--div.col mam AUTOMATICKY VHDONY PADDING => vnorene elementy su pekne odsadene od okrajov -->
                  <select class="form-select form-control" id="slZmena" aria-label="Default select example" v-model="myZmena">
                     <option value="VSETKY">VŠETKY</option>
                     <option value="ZMENA-1">RANNÁ</option>
                     <option value="ZMENA-2">POOBEDNÁ</option>
                     <option value="ZMENA-3">NOČNÁ</option>
                  </select>
               </div>
            </div>

            <div class="row mb-2">
               <label for="slPec" class="col-2 col-sm-3 pe-0 col-form-label">Pec</label>
               <div class="col pe-0">
                  <!--div.col mam AUTOMATICKY VHDONY PADDING => vnorene elementy su pekne odsadene od okrajov -->
                  <select class="form-select form-control" id="slPec" aria-label="Default select example" v-model="myPec">
                     <option value="PEC_A">PEC A</option>
                     <option value="PEC_B">PEC B</option>
                     <option value="PEC_C">PEC C</option>
                     <option value="PEC_D">PEC D</option>
                     <option value="PEC_G">PEC G</option>
                     <option value="PEC_H">PEC H</option>
                  </select>
               </div>
            </div>
         </div>


         <div class="row row-cols-2">
            <div class="col">
            <button v-on:click="dajDataAPI" type="button" class="btn btn-primary me-0" style="width:100%">
               <span v-show="!loading"> ZOBRAZ DÁTA</span>
               <span v-show="loading" class="spinner-border spinner-border" style="vertical-align:middle"></span>
               
               <span v-show="loading" role="status" style="vertical-align:middle; margin-left:1rem">LOADING...</span>
            </button>
            </div>
            <div class="col">
               <button @click.prevent="dajXLSXFromAPI" type="button" style="width:100%" class="col btn btn-success">
                  <span v-show="!loadingXLSX">Export do XLSX</span>
                  <span v-show="loadingXLSX" class="spinner-border spinner-border" style="vertical-align:middle"></span>
                  <span v-show="loadingXLSX" role="status" style="vertical-align:middle; margin-left:1rem">LOADING...</span>
               </button>
            </div>
         </div>

         <a id="popoverButton" class="text-success mt-2" href="#" role="button" data-bs-toggle="popover" title="POZNAMKA"
            data-bs-content="Reálne namerané hodnoty su reprezentované farebnými kruhovými bodmi. Sivé línie medzi vykreslenými bodmi sú LEN odhadovené hodnoty veličiny v danom čase.">POZNÁMKA</a>
      </div>
   </form>


   <div class="container-fluid ps-0 pe-0 ps-sm-2 pe-sm-2">
      <div class="row row-cols-1 row-cols-xxl-2">
         <!-- <div class="chart col" v-show="zobraz.mojVykon">
            <MyBarChart :pChartData=myDataMojVykon :myChartOptions=myOptionsTimeComp v-on:click="showModal('POCITANY VYKON', myDataMojVykon, myOptionsTimeComp)"></MyBarChart>
         </div> -->
         <div class="chart col" v-show="zobraz.DBVykon">
            <MyBarChart :pChartData=myDataDBVykon :myChartOptions=myOptionsTimeComp v-on:click="showModal('VÝKON [kW]', myDataDBVykon, myOptionsTimeComp)"></MyBarChart>
         </div>
         <!-- <div class="chart col" v-show="zobraz.okamzitaSpotreba">
            <MyBarChart :pChartData=myDataSpotreba :myChartOptions=myOptionsTimeComp v-on:click="showModal('OKAMZITA SPOTREBA', myDataSpotreba, myOptionsTimeComp)"></MyBarChart>
         </div> -->
         <div class="chart col position-relative" v-show="zobraz.spotrebaZmien">
            <p ref="celkovaspotreba" class="spotreba-celkon border rounded-2 lh-1 p-1 fw-semibold text-bg-primary" v-show="zobraz.spotrebaZmien">SPOLU:
               {{ spotreba_celkom.toFixed(2) }} kWh</p>
            <BarChart :pChartData="myDataSpotrebaBAR"></BarChart>
         </div>
         <div class="chart col" v-show="zobraz.napatie">
            <MyBarChart :pChartData=myDataNapatie :myChartOptions=myOptionsTimeComp v-on:click="showModal('NAPÄTIE [V]', myDataNapatie, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.prud">
            <MyBarChart :pChartData=myDataPrud :myChartOptions=myOptionsTimeComp v-on:click="showModal('PRÚD [A]', myDataPrud, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.teplotaVstup">
            <MyBarChart :pChartData=myDataVoda :myChartOptions=myOptionsTimeComp v-on:click="showModal('TEPLOTA VODY vstup / vystup [°C]', myDataVoda, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.tlak">
            <MyBarChart :pChartData=myDataTlak :myChartOptions=myOptionsTimeComp v-on:click="showModal('TLAK [Pa]', myDataTlak, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.sobertVstup">
            <MyBarChart :pChartData=myDataSobertVstup :myChartOptions=myOptionsTimeComp v-on:click="showModal('SOBERT VSTUP [%]', myDataSobertVstup, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.sobertVykon">
            <MyBarChart :pChartData=myDataSobertVykon :myChartOptions=myOptionsTimeComp v-on:click="showModal('SOBERT VÝKON [kW]', myDataSobertVykon, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.rzPrisposobenie">
            <MyBarChart :pChartData=myDataRzPrisposobenie :myChartOptions=myOptionsTimeComp v-on:click="showModal('RZ PRISPÔSOBENIE [Ω]', myDataRzPrisposobenie, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.prietok">
            <MyBarChart :pChartData=myDataPrietok :myChartOptions=myOptionsTimeComp v-on:click="showModal('PRIETOK [l/min]', myDataPrietok, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.frekvencia">
            <MyBarChart :pChartData=myDataFrekvencia :myChartOptions=myOptionsTimeComp v-on:click="showModal('FREKVENCIA [Hz]', myDataFrekvencia, myOptionsTimeComp)"></MyBarChart>
         </div>
         <div class="chart col" v-show="zobraz.teplotaP1">
            <MyBarChart :pChartData=myDataTeplotaP1P2Okruh :myChartOptions=myOptionsTimeComp
               v-on:click="showModal('TEPLOTA VODY pec1 / pec2 / (primárny okruh) [°C]', myDataTeplotaP1P2Okruh, myOptionsTimeComp)"></MyBarChart>
         </div>         
      </div>
   </div>
</template>

<script>

import MyBarChart from './components/MyBarChart.vue'
import BarChart from './components/BarChart.vue'
import LineChartAPI from './components/LineChartAPI.vue'
import axios from 'axios'
import * as Helpers from "./helpers"
import * as dayjs from 'dayjs'
//import * as bootstrap from 'bootstrap'
//import 'bootstrap/scss/bootstrap.scss'

const KWH = 3600000;

export default {
   name: 'App',
   components: { MyBarChart, BarChart, LineChartAPI, VueDatePicker },

   //============================================ DATA ===================================================
   data() {
      const self = this;
      return {                  
         framework:[
            //["A1","B1","C1"],["A2","B2","C2"],["A3","B3","C3"]
            {name:"George Washington", birthday: "1732-02-22"},
            {name:"John Adams", birthday: "1735-10-19"},
         ],                  
         dAnnotations:[],         
         zobraz: {
            frekvencia: true, /*mojVykon: true,*/ DBVykon: true, /*okamzitaSpotreba: true,*/ spotrebaZmien: true, napatie: true, prud: true, tlak: true,
            sobertVstup: true, sobertVykon: true, rzPrisposobenie: true, prietok: true, teplotaVstup: true, teplotaP1: true, teplotaP2: true, teplotaOkruh: true
         },
         //zobraz: true,
         picked: "CUSTOM",
         loading: false,
         loadingXLSX: false,
         spotreba_celkom: -99999.994,
         //tOD: new Date() - 30 * 60 * 1000, //odcitavaju sa MINUTY
         //tOD: new Date().setMinutes(new Date().getMinutes() - 30),
         tDO: new Date(),
         tOD: new Date(),

         dpDO: new Date(Date.now()),
         dpOD: new Date().setHours(new Date().getHours() - 24),

         TimeBoundary: { minTime: "1970-01-01T00:00:00", maxTime: "1970-01-01T02:00:00" },

         myOptionsTime: {
            scales: {
               x: {
                  //max: this.TimeBoundary.maxTime,//new Date("1970-01-01T02:00:00"),
                  //min: this.TimeBoundary.minTime,//new Date("1970-01-01T00:00:00"),
                  type: 'time',
                  time: {
                     unit: "hour",
                     displayFormats: {
                        hour: "DD.MM. | HH:mm",
                        minute: "DD.MM. | HH:mm"
                     }
                  }
               }
            }
         },
         myModalData: {
            labels: [0],
            datasets: [{ data: [0], label: "MODALNE DATA", backgroundColor: "#b34700" }]
         },
          myModalOptions: {
            scales: {
               x: {
                  //max: this.TimeBoundary.maxTime,//new Date("1970-01-01T02:00:00"),
                  //min: this.TimeBoundary.minTime,//new Date("1970-01-01T00:00:00"),
                  type: 'time',
                  time: {
                     unit: "hour",
                     displayFormats: {
                        hour: "DD.MM. | HH:mm",
                        minute: "DD.MM. | HH:mm"
                     }
                  }
               }
            }
         },


         // myDataMojVykon: {
         //    labels: [0],
         //    datasets: [{ data: [0], label: "POCITANY VYKON [kW]", backgroundColor: "#33cc33" }]
         // },
         myDataDBVykon: {
            labels: [0],
            datasets: [{ data: [0], label: "VÝKON [kW]", backgroundColor: "#339933" }]
         },
         // myDataSpotreba: {
         //    labels: [0],
         //    datasets: [{ data: [0], label: "OKAMZITA SPOTREBA [Ws]", backgroundColor: "#ffbf00" }]
         // },
         myDataSpotrebaBAR: {
            labels: [0],
            datasets: [{ data: [0], label: "SPOTREBA ZMIEN [kWh]", backgroundColor: "#ff944d", borderColor: "#b34700", borderWidth: 2 }]
         },
         myDataNapatie: {
            //labels: [ 'January', 'February', 'March' ],
            //datasets: [ { data: [40, 20, 12] } ]
            labels: [0],
            datasets: [{ data: [0], label: "NAPÄTIE [V]", backgroundColor: "#f87979" }]
         },
         myDataPrud: {
            labels: [0],
            datasets: [{ data: [0], label: "PRÚD [A]", backgroundColor: "#0066ff" }]
         },
         myDataTlak: {
            labels: [0],
            datasets: [{ data: [0], label: "TLAK [Pa]", backgroundColor: "#000000" }]
         },
         myDataSobertVstup: {
            labels: [0],
            datasets: [{ data: [0], label: "Sobert VSTUP [%]", backgroundColor: "#ffcccc" }]
         },
         myDataSobertVykon: {
            labels: [0],
            datasets: [{ data: [0], label: "Sobert VÝKON [kW]", backgroundColor: "#ffcc99" }]
         },
         myDataVoda: {
            labels: [0],
            datasets: [{ data: [0], label: "VODA VSTUP [°C]", backgroundColor: "#9933ff" }, { data: [0], label: "VODA VYSTUP [°C]", backgroundColor: "#ff6600" }]
         },
         myDataFrekvencia: {
            labels: [0],
            datasets: [{ data: [0], label: "FREKVENCIA [Hz]", backgroundColor: "#cc3300" }]
         },
         myDataRzPrisposobenie: {
            labels: [0],
            datasets: [{ data: [0], label: "RZ PRISPÔSOBENIE [Ω]", backgroundColor: "#804000" }]
         },
         myDataPrietok: {
            labels: [0],
            datasets: [{ data: [0], label: "PRIETOK [l/min]", backgroundColor: "#3399ff" }]
         },
         myDataTeplotaP1P2Okruh: {
            labels: [0],
            datasets: [{ data: [0], label: "TEPLOTA P1 [°C]", backgroundColor: "#ff6666" }, { data: [0], label: "TEPLOTA P2 [°C]", backgroundColor: "#d65cad" },
            { data: [0], label: "TEPLOTA OKRUH [°C]", backgroundColor: "#9933ff" }]
         },
         myZmena: "VSETKY",
         myPec: "PEC_C"
      }
   },

   //========================================== METHODS  =================================================
   methods: {          
      
      dateFormat(date){
         const day = date.getDate();
         const month = date.getMonth() + 1;
         const year = date.getFullYear();
         const hour = date.getHours();
         const minute = date.getMinutes();
         return moment(date).format("DD.MM.YYYY HH:mm");
         return `${day}.${month}.${year}, ${hour}:${minute}`;
      },
      
      getXLSXFileName(){
         
         return "export_" + this.myPec +"_"+this.parsujDatum(this.tOD) +"_"+ this.parsujDatum(this.tDO);

      },
      
      exportToXLSX(dataJSON,pec){         
         //console.log(this.getXLSXFileName());
         const XLSX = xlsx;
         const workbook = XLSX.utils.book_new();
         //const worksheet = XLSX.utils.aoa_to_sheet(this.framework);
         const worksheet = XLSX.utils.json_to_sheet(dataJSON); //this.framework
         XLSX.utils.book_append_sheet(workbook,worksheet,pec);
         var fileName = this.getXLSXFileName();
         XLSX.writeFile(workbook,fileName+".XLSX");
      },
      
      //funkcia naplni zdielane pole, ktoreho obasah sa pouzije pre plugin k ChartJS packageu "annotation" 
      mGetArrAnnotations()
      {  
         //console.log("OD: {0}",this.dpOD); //console.log("DO: {0}",this.dpDO);
         this.dAnnotations = [];
         let zaciatkyZmien = Helpers.dajZaciatkyZmien(this.tOD, this.tDO);         
         for(let zmenaDate of zaciatkyZmien){
              //console.log('ZOBRAZOVANA LINIA ZMENY: {0}'+zmenaDate);
              let newANNOTATION={ type: 'line',                 
                                 //xMin: new Date("2023-12-13T00:00:00"), //xMax: new Date("2023-12-13T00:00:00"),                                                                
                                 xMin: zmenaDate,
                                 xMax: zmenaDate,                                                                
                                 borderColor: 'rgb(255, 99, 132, 0.5)',
                                 borderWidth: 1};
                     
               this.dAnnotations.push(newANNOTATION);
         }  
         //console.log("dAnnotations: ", this.dAnnotations);
      },

      showModal(pTitle, pData, pOptions) {
         //console.log("Emitnuty globalny showModal");
         EMT.emit("showModal", pTitle, pData, pOptions);
         //this.myModalData = pData;
      },

      dajXLSXFromAPI() {
         console.warn("ODOSLANY XLS GET REQUEST NA SERVER");
         
         this.loadingXLSX = true;
         this.inicializujOdDo();
         //https://stackoverflow.com/questions/49257650/how-check-if-vue-is-in-development-mode
         //if (import.meta.env.DEV)
         var URL = "http://192.168.45.1:2033/record/intervalAll";
         //else
         //var URL = "http://192.168.45.1:2031/record/interval";
         // var URL = "https://localhost:7117/record/interval?dateStart="+pOD+"&dateEnd="+pDO;
         axios
            //.get("https://localhost:7117/record/interval?dateStart=2023-10-16T12:00:00&dateEnd=2023-10-16T19:15:00")
            //.get(URL)
            .get(URL, {
               params: {
                  //dateStart: "2023-10-16T12:00:00",
                  //dateEnd: "2023-10-16T19:10:00",
                  dateStart: this.parsujDatum(this.tOD),
                  dateEnd: this.parsujDatum(this.tDO),
                  zmena: this.myZmena,
                  pecId: this.myPec,
               },
            })

            .then((response) => {
                              
               // SPOTREBA ZMIEN
               // --------------------------------------------------------------------------------------------------------------------------------------
               // console.info("DOSLI DATA ZO SERVERA \n [object Object] je jeden zaznam z DB \n");
               // console.log(response.data);               
               // --------------------------------------------------------------------------------------------------------------------------------------               
               //CASOVA OS
               //let reducedData = Helpers.RedukujPocetHodnot(response.data, 200);
               const completeData = response.data;               
               
               console.log("############ Kompletny JSON ############");
               console.log(completeData);
               console.log("########################################");
               
               this.exportToXLSX(completeData,this.myPec);

               const DatumCasXLSX = completeData.map(rec => this.parsujDatum(rec.dateTime));
               //this.TimeBoundary = PomLabels;// Helpers.DodajKrajneHodnoty(new Date(PomLabels[0]), new Date(PomLabels[PomLabels.length - 1]));

               //DB VYKON
               const VykonXLSX = completeData.map(rec => rec.vykon);

               //OKAMZITA SPOTREBA
               // PomData = reducedData.map(rec => rec.spotreba);
               
               //NAPATIE
               const NapatieXLSX = completeData.map(rec => rec.napatie);               

               //PRUD
               const PrudXLSX = completeData.map(rec => rec.prud);               

               //TEPLOTA VODY
               const TeplotaVodyVstupXLSX = completeData.map(rec => rec.tVodaVstup.toFixed(2)); 
               const TeplotaVodyVystupXLSX = completeData.map(rec => rec.tVodaVystup.toFixed(2));
                              
               //TLAK
               const TlakXLSX = completeData.map(rec => rec.tlak);               

               //SOBERT VSTUP
               const SobertVstupXLSX = completeData.map(rec => rec.sobertVstup);               

               //SOBERT VYKON
               const SobertVykonXLSX = completeData.map(rec => rec.sobertVykon);
               
               //RZPRISPOSOBENIE
               const RzPrisposobenieXLSX = completeData.map(rec => rec.rzPribenie);               

               //FREKVENCIA
               const FrekvenciaXLSX = completeData.map(rec => rec.frekvencia);               

               //PRIETOK
               const PrietokXLSX = completeData.map(rec => rec.prietokVody);              
               //-------------------------------------------------------------------------------------------------------------------------------------------------------
               //TEPLOTA P1
               const TeplotaP1XLSX = completeData.map(rec => rec.teplotaP1);               

               //TEPLOTA P2
               const TeplotaP2XLSX = completeData.map(rec => rec.teplotaP2);
               
               //TEPLOTA OKRUH
               const TeplotaOkruhXLSX = completeData.map(rec => rec.teplotaOkruh);               
               
               //NA ZAVER UROBIM a VYKRESLIM (pomocou CP) ZMENU STAVU pola dAnnotations => 'reaktivny framework: REAGUJE NA ZMENU STAVU, KTORY JE DANY data(){} OBJEKTOM'
               //this.mGetArrAnnotations();
               
               this.loadingXLSX = false;
               //-------------------------------------------------------------------------------------------------------------------------------------------------------
            })
            .catch((error) => {
               console.error(error);
               this.loadingXLSX = false;
            });
      },
      
      
      
      dajDataAPI() {
         console.warn("ODOSLANY GET REQUEST NA SERVER");
         // console.log(import.meta.env.DEV);
         // console.log(import.meta.env.PROD);

         this.loading = true;
         this.inicializujOdDo();
         this.zobraz = Helpers.ZobrazPec(this.myPec);

         //https://stackoverflow.com/questions/49257650/how-check-if-vue-is-in-development-mode
         //if (import.meta.env.DEV)
         //var URL = "https://localhost:7117/record/interval";
         //else
         var URL = "http://192.168.45.1:2033/record/interval";
         // var URL = "https://localhost:7117/record/interval?dateStart="+pOD+"&dateEnd="+pDO;
         axios
            //.get("https://localhost:7117/record/interval?dateStart=2023-10-16T12:00:00&dateEnd=2023-10-16T19:15:00")
            //.get(URL)
            .get(URL, {
               params: {
                  //dateStart: "2023-10-16T12:00:00",
                  //dateEnd: "2023-10-16T19:10:00",
                  dateStart: this.parsujDatum(this.tOD),
                  dateEnd: this.parsujDatum(this.tDO),
                  zmena: this.myZmena,
                  pecId: this.myPec,
               },
            })

            .then((response) => {
                              
               // SPOTREBA ZMIEN
               // --------------------------------------------------------------------------------------------------------------------------------------
               // console.info("DOSLI DATA ZO SERVERA \n [object Object] je jeden zaznam z DB \n");
               // console.log(response.data);
               this.spotreba_celkom = 0;
               //Helpers.DodajSpotrebu(response.data);
               //console.log("DATA SO SPOTREBOU: {0}", response.data);
               let PomLabels = ["ZMENA-1", "ZMENA-2", "ZMENA-3"]
               let PomData = PomLabels.map(zmenaa => {
                  var total = 0;
                  response.data.forEach(rec => (rec.zmena == zmenaa) && (total += rec.okamzitaSpotreba));
                  this.spotreba_celkom += total / KWH;
                  return total / KWH;
               })
               PomLabels = ["RANNÁ", "DENNÁ", "NOČNÁ"]
               console.log("total:{0}", PomData);
               this.myDataSpotrebaBAR = { labels: PomLabels, datasets: [{ data: PomData, label: "SPOTREBA ZMIEN [kWh]", backgroundColor: "#ff944d" }] }
               // --------------------------------------------------------------------------------------------------------------------------------------
               //CASOVA OS
               //let reducedData = Helpers.RedukujPocetHodnot(response.data, 200);
               let reducedData = response.data;
               PomLabels = reducedData.map(rec => this.parsujDatum(rec.dateTime));
               this.TimeBoundary = Helpers.DodajKrajneHodnoty(new Date(PomLabels[0]), new Date(PomLabels[PomLabels.length - 1]));

               //POCITANY VYKON
               // PomData = reducedData.map(rec => rec.mojvykon);
               // this.myDataMojVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "POCITANY VYKON [kW]", backgroundColor: "#33cc33" }] }

               //DB VYKON
               PomData = reducedData.map(rec => rec.vykon);
               this.myDataDBVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "VÝKON [kW]", backgroundColor: "#339933" }] }

               //OKAMZITA SPOTREBA
               // PomData = reducedData.map(rec => rec.spotreba);
               // this.myDataSpotreba = { labels: PomLabels, datasets: [{ data: PomData, label: "OKAMZITA SPOTREBA [Ws]", backgroundColor: "#ffbf00" }] }

               //NAPATIE
               PomData = reducedData.map(rec => rec.napatie);
               this.myDataNapatie = { labels: PomLabels, datasets: [{ data: PomData, label: "NAPÄTIE [V]", backgroundColor: "#f87979" }] }

               //PRUD
               PomData = reducedData.map(rec => rec.prud);
               this.myDataPrud = { labels: PomLabels, datasets: [{ data: PomData, label: "PRÚD [A]", backgroundColor: "#0066ff" }] }

               //TEPLOTA VODY
               PomData = reducedData.map(rec => rec.tVodaVstup.toFixed(2)); let PomData1 = reducedData.map(rec => rec.tVodaVystup.toFixed(2));
               this.myDataVoda = {
                  labels: PomLabels, datasets: [{ data: PomData, label: "VODA VSTUP [°C]", backgroundColor: "#9933ff" },
                  { data: PomData1, label: "VODA VYSTUP [°C]", backgroundColor: "#ff6600" }]
               }

               //TLAK
               PomData = reducedData.map(rec => rec.tlak);
               this.myDataTlak = { labels: PomLabels, datasets: [{ data: PomData, label: "TLAK VODY [Pa]", backgroundColor: "#000000" }] }

               //SOBERT VSTUP
               PomData = reducedData.map(rec => rec.sobertVstup);
               this.myDataSobertVstup = { labels: PomLabels, datasets: [{ data: PomData, label: "SOBERT VSTUP [%]", backgroundColor: "#ffcccc" }] }

               //SOBERT VYKON
               PomData = reducedData.map(rec => rec.sobertVykon);
               this.myDataSobertVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "SOBERT VÝKON  [kW]", backgroundColor: "#ffcc99" }] }

               //RZPRISPOSOBENIE
               PomData = reducedData.map(rec => rec.rzPribenie);
               this.myDataRzPrisposobenie = { labels: PomLabels, datasets: [{ data: PomData, label: "RZ PRISPÔSOBENIE [Ω]", backgroundColor: "#804000" }] }

               //FREKVENCIA
               PomData = reducedData.map(rec => rec.frekvencia);
               this.myDataFrekvencia = { labels: PomLabels, datasets: [{ data: PomData, label: "FREKVENCIA [Hz]", backgroundColor: "#cc3300" }] }

               //PRIETOK
               PomData = reducedData.map(rec => rec.prietokVody);
               this.myDataPrietok = { labels: PomLabels, datasets: [{ data: PomData, label: "PRIETOK [l/min]", backgroundColor: "#3399ff" }] }

               //-------------------------------------------------------------------------------------------------------------------------------------------------------
               //TEPLOTA P1
               PomData = reducedData.map(rec => rec.teplotaP1);
               this.myDataTeplotaP1 = { labels: PomLabels, datasets: [{ data: PomData, label: "TEPLOTA P1 [°C]", backgroundColor: "#ff6666" }] }

               //TEPLOTA P2
               PomData1 = reducedData.map(rec => rec.teplotaP2);
               this.myDataTeplotaP2 = { labels: PomLabels, datasets: [{ data: PomData1, label: "TEPLOTA P2 [°C]", backgroundColor: "#d65cad" }] }

               //TEPLOTA OKRUH
               let PomData2 = reducedData.map(rec => rec.teplotaOkruh);
               this.myDataTeplotaOkruh = { labels: PomLabels, datasets: [{ data: PomData2, label: "TEPLOTA OKRUH [°C]", backgroundColor: "#d24dff" }] }

               //TEPLOTA P1+P2+OKRUH
               this.myDataTeplotaP1P2Okruh = {
                  labels: PomLabels, datasets: [{ data: PomData, label: "TEPLOTA P1 [°C]", backgroundColor: "#ff6666" },
                  { data: PomData1, label: "TEPLOTA P2 [°C]", backgroundColor: "#d65cad" }, { data: PomData2, label: "TEPLOTA OKRUH [°C]", backgroundColor: "#9933ff" }]
               }
               
               //NA ZAVER UROBIM a VYKRESLIM (pomocou CP) ZMENU STAVU pola dAnnotations => 'reaktivny framework: REAGUJE NA ZMENU STAVU, KTORY JE DANY data(){} OBJEKTOM'
               //this.mGetArrAnnotations();
               
               this.loading = false;
               //-------------------------------------------------------------------------------------------------------------------------------------------------------
            })
            .catch((error) => {
               console.error(error);
               this.loading = false;
            });
      },


      parsujDatum(pDatum) {
         return moment(pDatum).format("YYYY-MM-DDTHH:mm:ss");
      },
      parsujDatumForSeries(pDatum) {

         return moment(pDatum).format("DD.MM.YYYY HH:mm");

      },
      parsujDatumForLabels(pDatum) {
         return moment(pDatum).format("DD.MM. - HH:mm:ss");
      },

      inicializujOdDo() {
         switch (this.picked) {
            case ('WEEK'): this.tDO = new Date(); this.tOD = Helpers.WeekBack(this.tDO); this.disable_picker = true; break;
            case ('MONTH'): this.tDO = new Date(); this.tOD = Helpers.MonthBack(this.tDO); break;
            case ('CUSTOM'): this.tDO = this.dpDO; this.tOD = this.dpOD; break;
         }
      },
      pocitajSirku() {
         const WindowWidth = window.innerWidth;
         const size = WindowWidth / 1320;
         if ((size < 0.6) || (size > 1)) return;
         //console.log('Font:' + 16 * WindowWidth / 1920 + "px");
         this.$refs.celkovaspotreba.style.fontSize = WindowWidth / 1320 + "rem";
      }
   },
   //========================================== MOUNTED =================================================
   mounted() {
      window.onresize = this.pocitajSirku;
      //this.mGetArrAnnotations();
   },
   //========================================== COMPUTED =================================================
   computed: {
      cp_disable_picker() {
         if (this.picked == 'CUSTOM')
            return false;
         else
            return true;
      },
      myOptionsTimeComp() {
         return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               x: {
                  max: this.TimeBoundary.maxTime,//new Date("1970-01-01T02:00:00"),
                  min: this.TimeBoundary.minTime,//new Date("1970-01-01T00:00:00"),
                  type: 'time',
                  time: {
                     format: "DD.MM.",
                     unit: "hour",
                     tooltipFormat: 'DD.MM.yyyy HH:mm:ss',          
                     displayFormats: {
                        hour: "DD.MM HH[h]",
                        minute: "DD  HH:mm"
                     }
                  }
               }
            },
            //#region  PLUGINS + ANNOTATION 
            //plugins: {
               //customCanvasBackgroundColor: {
               //   color: 'white',
               //},
               //annotation: {
               //         drawTime: 'afterDatasetsDraw',
               //         annotations: this.dAnnotations
                        
                        
                        // [                          
                        //     {
                        //         // Indicates the type of annotation
                        //         type: 'line',
                        //         xMin: new Date("1970-01-01T00:02:00"),
                        //         xMax: new Date("1970-01-01T00:02:00"),                         
                        //         borderColor: 'rgb(255, 99, 132)',
                        //         borderWidth: 3,
                        //     }
                        //    //  ,                
                        //    //  {
                        //    //      // Indicates the type of annotation
                        //    //      type: 'line',
                        //    //      //xMin: dayjs('1070-01-01T00:02:00').valueOf(),//new Date("1970-01-01T00:02:00"),
                        //    //      //xMax: dayjs('1070-01-01T00:02:00').valueOf(),//new Date("1970-01-01T00:02:00"),
                        //    //      yMin: -5,
                        //    //      yMax: 5,
                        //    //      borderColor: 'rgb(255, 99, 132)',
                        //    //      borderWidth: 2,
                        //    //  },
                        //    //  {
                        //    //      // Indicates the type of annotation
                        //    //      type: 'line',
                        //    //      //mode: 'vertical',                               
                        //    //      //value: new Date("1970-01-01T00:01:00"),
                        //    //      ///value:new Date("1970-01-01T00:03:00"),
                        //    //      borderColor: 'rgb(255, 99, 132)',
                        //    //      borderWidth: 3                 
                        //    //  }
                        // ]
                    //}
            //}
            //#endregion
         }
      },      
   }
}
</script>
<!-- ========================================== STYLE ================================================= -->
<style scoped>
* {

   font-family: Arial, Helvetica, sans-serif;
}

.spotreba-celkon {
   position: absolute;
   top: 40px;
   left: 50px;
   color: gray;
   /* margin-bottom: -3rem; */
   /* margin-top: 1rem;  */
   /* font-size: calc(var(--bs-body-font-size)/1) */
}

.row {
   margin-left: 0;
   margin-right: 0;
}


@media (max-width: 576px) {
   .chart.col {
      padding-left: 0;
      padding-right: 0;
   }
}
</style>
