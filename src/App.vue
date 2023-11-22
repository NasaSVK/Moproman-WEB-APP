<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
</script>
<template>
  <div class="container-fluid">
    <form class="row sticky-top bg-gray-200 bg-gradient border-bottom">
      <fieldset class="col-auto mb-0">
        <legend class="col-form-label pt-0">Interval</legend>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="rdbTzden" value="WEEK" v-model="picked">
          <label class="form-check-label" for="rdbTzden">
            TYZDENNY
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="rdbMesiac" value="MONTH" v-model="picked">
          <label class="form-check-label" for="rdbMesiac">
            MESACNY
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="rdbCustom" value="CUSTOM" v-model="picked">
          <label class="form-check-label" for="rdbCustom">
            VLASTNY
          </label>
        </div>
      </fieldset>

      <fieldset class="col-auto mb-0 mt-4 pe-0">
        <label class="col-auto d-block mb-4 mt-2">Od</label>
        <label class="col-auto">Do</label>
      </fieldset>

      <fieldset class="col mb-0 ps-1 mt-4">
        <VueDatePicker :disabled="cp_disable_picker" id="dtpOD" class="picker mb-2" v-model="dpOD"></VueDatePicker>
        <VueDatePicker :disabled="cp_disable_picker" id="dtpDO" class="picker mb-2" v-model="dpDO"></VueDatePicker>
      </fieldset>

      <!-- align-self-end -->

      <div class="col-sm-auto ps-2 mt-sm-4">
        <div class="row mb-2">
          <label for="slZmena" class="col-2 col-sm-3 col-form-label">Zmena</label>
          <div class="col">
            <!--div.col mam AUTOMATICKY VHDONY PADDING => vnorene elementy su pekne odsadene od okrajov -->
            <select class="form-select form-control" id="slZmena" aria-label="Default select example" v-model="myZmena">
              <option value="VSETKY">VSETKY</option>
              <option value="ZMENA-1">RANNA</option>
              <option value="ZMENA-2">POOBEDNA</option>
              <option value="ZMENA-3">NOCNA</option>
            </select>
          </div>
        </div>

        <div class="row mb-2">
          <label for="slPec" class="col-2 col-sm-3 col-form-label">Pec</label>
          <div class="col">
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


      <div class="row justify-content-center">
        <button v-on:click="dajDataAPI" type="button" class="btn btn-primary ms-4" style="width:100%;">
          <span v-show="!loading"> ZOBRAZ DATA</span>
          <span v-show="loading" class="spinner-border spinner-border me-2" style="vertical-align:middle"></span>
          <span v-show="loading" role="status" style="vertical-align:middle">LOADING...</span>
        </button>
      </div>

      <a id="popoverButton" class="text-success mt-2" href="#" role="button" data-bs-toggle="popover" title="POZNAMKA"
        data-bs-content="Realne namerane hodnoty su reprezentovane farebnymi kruhovymi bodmi. Sive linie medzi vykreslenymi bodmi su LEN odhadovene hodnoty veliciny v danom case">POZNAMKA</a>
    </form>

    <!-- <div class="container-fluid"> -->
    <div class="row row-cols-1 row-cols-xxl-2">
      <!-- <div class="row"> -->
      <div class="col" v-show="zobraz.mojVykon">
        <MyBarChart :myChartData=myDataMojVykon :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.DBVykon">
        <MyBarChart :myChartData=myDataDBVykon :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.okamzitaSpotreba">
        <MyBarChart :myChartData=myDataSpotreba :myChartOptions=myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col position-relative" v-show="zobraz.spotrebaZmien">
        <p ref="celkovaspotreba" class="spotreba-celkon border rounded-2 lh-1 p-1 fw-semibold text-bg-primary"
          v-show="zobraz.spotrebaZmien">SPOLU:
          {{ spotreba_celkom.toFixed(2) }} kWh</p>
        <BarChart :myChartData="myDataSpotrebaBAR"></BarChart>
      </div>
      <div class="col" v-show="zobraz.napatie">
        <MyBarChart :myChartData=myDataNapatie :myChartOptions=myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col" v-show="zobraz.prud">
        <MyBarChart :myChartData=myDataPrud :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.teplotaVstup">
        <MyBarChart :myChartData=myDataVoda :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.tlak">
        <MyBarChart :myChartData=myDataTlak :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.sobertVstup">
        <MyBarChart :myChartData=myDataSobertVstup :myChartOptions=myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col" v-show="zobraz.sobertVykon">
        <MyBarChart :myChartData=myDataSobertVykon :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.rzPrisposobenie">
        <MyBarChart :myChartData=myDataRzPrisposobenie :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.prietok">
        <MyBarChart :myChartData=myDataPrietok :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="zobraz.frekvencia">
        <MyBarChart :myChartData=myDataFrekvencia :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>

      <div class="col" v-show="zobraz.teplotaP1">
        <MyBarChart :myChartData=myDataTeplotaP1P2Okruh :myChartOptions=myOptionsTimeComp>
        </MyBarChart>
      </div>
      <!-- <div class="col" v-show="this.zobraz.teplotaP1">
        <MyBarChart :myChartData=this.myDataTeplotaP1 :myChartOptions=this.myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="this.zobraz.teplotaP2">
        <MyBarChart :myChartData=this.myDataTeplotaP2 :myChartOptions=this.myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col" v-show="this.zobraz.teplotaOkruh">
        <MyBarChart :myChartData=this.myDataTeplotaOkruh :myChartOptions=this.myOptionsTimeComp>
        </MyBarChart>
      </div> -->
    </div>
  </div>
</template>

<script>

import MyBarChart from './components/MyBarChart.vue'
import BarChart from './components/BarChart.vue'
import LineChartAPI from './components/LineChartAPI.vue'
import axios from 'axios'
import * as Helpers from "./helpers"
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
      zobraz: { frekvencia: true, mojVykon: true, DBVykon: true, okamzitaSpotreba: true, spotrebaZmien: true, napatie: true, prud: true, tlak: true, sobertVstup: true, sobertVykon: true, rzPrisposobenie: true, prietok: true, teplotaVstup: true, teplotaP1: true, teplotaP2: true, teplotaOkruh: true },
      //zobraz: true,
      picked: "CUSTOM",
      loading: false,
      spotreba_celkom: -99999.994,
      //tOD: new Date() - 30 * 60 * 1000, //odcitavaju sa MINUTY
      //tOD: new Date().setMinutes(new Date().getMinutes() - 30),
      tDO: new Date(),
      tOD: new Date(),

      dpDO: new Date(),
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
      myDataMojVykon: {
        labels: [0],
        datasets: [{ data: [0], label: "POCITANY VYKON [W]", backgroundColor: "#33cc33" }]
      },
      myDataDBVykon: {
        labels: [0],
        datasets: [{ data: [0], label: "VYKON [W]", backgroundColor: "#339933" }]
      },
      myDataSpotreba: {
        labels: [0],
        datasets: [{ data: [0], label: "OKAMZITA SPOTREBA [Ws]", backgroundColor: "#ffbf00" }]
      },
      myDataSpotrebaBAR: {
        labels: [0],
        datasets: [{ data: [0], label: "SPOTREBA ZMIEN [kWh]", backgroundColor: "#ff944d", borderColor: "#b34700", borderWidth: 2 }]
      },
      myDataNapatie: {
        //labels: [ 'January', 'February', 'March' ],
        //datasets: [ { data: [40, 20, 12] } ]
        labels: [0],
        datasets: [{ data: [0], label: "NAPATIE [V]", backgroundColor: "#f87979" }]
      },
      myDataPrud: {
        labels: [0],
        datasets: [{ data: [0], label: "PRUD [A]", backgroundColor: "#0066ff" }]
      },
      myDataTlak: {
        labels: [0],
        datasets: [{ data: [0], label: "TLAK [Pa]", backgroundColor: "#000000" }]
      },
      myDataSobertVstup: {
        labels: [0],
        datasets: [{ data: [0], label: "Sobert VSTUP [?]", backgroundColor: "#ffcccc" }]
      },
      myDataSobertVykon: {
        labels: [0],
        datasets: [{ data: [0], label: "Sobert VYKON [W]", backgroundColor: "#ffcc99" }]
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
        datasets: [{ data: [0], label: "RZPrisposobenie [Hz]", backgroundColor: "#804000" }]
      },
      myDataPrietok: {
        labels: [0],
        datasets: [{ data: [0], label: "PRIETOK [l/s]", backgroundColor: "#3399ff" }]
      },
      myDataTeplotaP1P2Okruh: {
        labels: [0],
        datasets: [{ data: [0], label: "TEPLOTA P1 [°C]", backgroundColor: "#ff6666" }, { data: [0], label: "TEPLOTA P2 [°C]", backgroundColor: "#d65cad" }, { data: [0], label: "TEPLOTA OKRUH [°C]", backgroundColor: "#9933ff" }]
      },
      myZmena: "VSETKY",
      myPec: "PEC_C"
    }
  },

  //========================================== METHODS  =================================================
  methods: {
    dajDataAPI() {
      console.error("ODOSLANY GET REQUEST NA SERVER");
      this.loading = true;
      this.inicializujOdDo();
      this.zobraz = Helpers.ZobrazPec(this.myPec);

      //var URL = "https://localhost:7117/record/interval";
      var URL = "http://192.168.45.1:2030/record/interval";
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
          console.log("DOSLI DATA ZO SERVERA \n [object Object] je jeden zaznam z DB \n");
          console.log(response.data);
          this.spotreba_celkom = 0;
          Helpers.DodajSpotrebu(response.data);
          //console.log("DATA SO SPOTREBOU: {0}", response.data);
          let PomLabels = ["ZMENA-1", "ZMENA-2", "ZMENA-3"]
          let PomData = PomLabels.map(zmenaa => {
            var total = 0;
            response.data.forEach(rec => (rec.zmena == zmenaa) && (total += rec.spotreba));
            this.spotreba_celkom += total / KWH;
            return total / KWH;
          })

          //console.log("total:{0}", PomData);
          this.myDataSpotrebaBAR = { labels: PomLabels, datasets: [{ data: PomData, label: "SPOTREBA ZMIEN [kWh]", backgroundColor: "#ff944d" }] }
          // --------------------------------------------------------------------------------------------------------------------------------------
          //CASOVA OS
          let reducedData = Helpers.RedukujPocetHodnot(response.data, 200);
          PomLabels = reducedData.map(rec => this.parsujDatum(rec.dateTime));
          this.TimeBoundary = Helpers.DodajKrajneHodnoty(new Date(PomLabels[0]), new Date(PomLabels[PomLabels.length - 1]));

          //POCITANY VYKON
          PomData = reducedData.map(rec => rec.mojvykon);
          this.myDataMojVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "POCITANY VYKON [W]", backgroundColor: "#33cc33" }] }

          //DB VYKON
          PomData = reducedData.map(rec => rec.vykon);
          this.myDataDBVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "VYKON [W]", backgroundColor: "#339933" }] }

          //OKAMZITA SPOTREBA
          PomData = reducedData.map(rec => rec.spotreba);
          this.myDataSpotreba = { labels: PomLabels, datasets: [{ data: PomData, label: "OKAMZITA SPOTREBA [Ws]", backgroundColor: "#ffbf00" }] }

          //NAPATIE
          PomData = reducedData.map(rec => rec.napatie);
          this.myDataNapatie = { labels: PomLabels, datasets: [{ data: PomData, label: "NAPATIE [V]", backgroundColor: "#f87979" }] }

          //PRUD
          PomData = reducedData.map(rec => rec.prud);
          this.myDataPrud = { labels: PomLabels, datasets: [{ data: PomData, label: "PRUD [A]", backgroundColor: "#0066ff" }] }

          //TEPLOTA VODY
          PomData = reducedData.map(rec => rec.tVodaVstup.toFixed(2)); let PomData1 = reducedData.map(rec => rec.tVodaVystup.toFixed(2));
          this.myDataVoda = { labels: PomLabels, datasets: [{ data: PomData, label: "VODA VSTUP [°C]", backgroundColor: "#9933ff" }, { data: PomData1, label: "VODA VYSTUP [°C]", backgroundColor: "#ff6600" }] }

          //TLAK
          PomData = reducedData.map(rec => rec.tlak);
          this.myDataTlak = { labels: PomLabels, datasets: [{ data: PomData, label: "TLAK VODY [Pa]", backgroundColor: "#000000" }] }

          //SOBERT VSTUP
          PomData = reducedData.map(rec => rec.sobertVstup);
          this.myDataSobertVstup = { labels: PomLabels, datasets: [{ data: PomData, label: "SOBERT VSTUP [?]", backgroundColor: "#ffcccc" }] }

          //SOBERT VYKON
          PomData = reducedData.map(rec => rec.sobertVykon);
          this.myDataSobertVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "SOBERT VYKON  [W]", backgroundColor: "#ffcc99" }] }

          //RZPRISPOSOBENIE
          PomData = reducedData.map(rec => rec.rzPribenie);
          this.myDataRzPrisposobenie = { labels: PomLabels, datasets: [{ data: PomData, label: "RZ Prisposobenie [?/?]", backgroundColor: "#804000" }] }

          //FREKVENCIA
          PomData = reducedData.map(rec => rec.frekvencia);
          this.myDataFrekvencia = { labels: PomLabels, datasets: [{ data: PomData, label: "FREKVENCIA [Hz]", backgroundColor: "#cc3300" }] }

          //PRIETOK
          PomData = reducedData.map(rec => rec.prietokVody);
          this.myDataPrietok = { labels: PomLabels, datasets: [{ data: PomData, label: "PRIETOK [l/s]", backgroundColor: "#3399ff" }] }

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
          this.myDataTeplotaP1P2Okruh = { labels: PomLabels, datasets: [{ data: PomData, label: "TEPLOTA P1 [°C]", backgroundColor: "#ff6666" }, { data: PomData1, label: "TEPLOTA P2 [°C]", backgroundColor: "#d65cad" }, { data: PomData2, label: "TEPLOTA OKRUH [°C]", backgroundColor: "#9933ff" }] }
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
  created() {
    window.onresize = this.pocitajSirku;
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
              unit: "hour",
              displayFormats: {
                hour: "DD.MM[T]HH[h]",
                minute: "DD.MM[T]HH:mm"
              }
            }
          }
        },
        plugins: {
          customCanvasBackgroundColor: {
            color: 'white',
          }
        }
      }
    }
  },
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
</style>
