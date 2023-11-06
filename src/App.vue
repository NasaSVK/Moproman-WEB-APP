<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
</script>

<template>
  <div class="container-fluid  mt-2">
    <form class="row">
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
        <label class="col-auto d-block mb-4 mt-2">OD</label>
        <label class="col-auto">DO</label>
      </fieldset>

      <fieldset class="col mb-0 ps-1 mt-4">
        <VueDatePicker id="dtpOD" class="picker mb-2" v-model="dpOD"></VueDatePicker>
        <VueDatePicker id="dtpDO" class="picker mb-2" v-model="dpDO"></VueDatePicker>
      </fieldset>

      <!-- align-self-end -->

      <div class="col-auto ps-2 mt-4">
        <div class="row mb-2">
          <label for="slZmena" class="col-sm-3 col-form-label">Zmena</label>
          <div class="col-sm">
            <!--div.col mam AUTOMATICKY VHDONY PADDING => vnorene elementy su pekne odsadene od okrajov -->
            <select class="form-select form-control" id="slZmena" aria-label="Default select example" v-model="myZmena">
              <option value="VSETKY">VSETKY</option>
              <option value="ZMENA-1">RANNA</option>
              <option value="ZMENA-2">POOBEDNA</option>
              <option value="ZMENA-3">NOCNA</option>
            </select>
          </div>
        </div>

        <div class="row mb-2 justify-content-end">
          <label for="slPec" class="col-sm-3 col-form-label">Pec</label>
          <div class="col-sm">
            <!--div.col mam AUTOMATICKY VHDONY PADDING => vnorene elementy su pekne odsadene od okrajov -->
            <select class="form-select form-control" id="slPec" aria-label="Default select example" v-model="myPec">
              <option value="PEC_A">PEC A</option>
              <option value="PEC_B">PEC B</option>
              <option value="PEC_C">PEC C</option>
              <option value="PEC_D">PEC D</option>
              <option value="PEC_E">PEC E</option>
              <option value="PEC_F">PEC F</option>
              <option value="PEC_G">PEC G</option>
              <option value="PEC_H">PEC H</option>
            </select>
          </div>
        </div>
      </div>

      <!-- <div class="col-10"> -->
      <div class="row justify-content-center">
        <button v-on:click="dajDataAPI" type="button" class="btn btn-primary ms-4" style="width:100%;">ZOBRAZ
          DATA</button>
      </div>
      <!-- </div> -->
      <a id="popoverButton" class="text-success mt-2" href="#" role="button" data-bs-toggle="popover" title="POZNAMKA"
        data-bs-content="Sive linie medzi vykreslenymi podmi su len odhadovene hodnoty veliciny v danom case. Realne namerane hodnoty su reprezentovane farebnymi kruhovymi bodmi">POZNAMKA</a>
    </form>

    <!-- <div class="container-fluid"> -->
    <div class="row row-cols-1 row-cols-xxl-2">
      <div class="col">
        <MyBarChart :chartData=this.myDataVykon :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col">
        <MyBarChart :chartData=this.myDataSpotreba :chartOptions=this.myOptionsTimeComp>
        </MyBarChart>
      </div>
      <div class="col">
        <!-- <p class="spotreba-celkon">CELKOVA SPOTREBA: {{ spotreba_celkom.toFixed(4) }} kWh</p> -->
        <BarChart :chartData="this.myDataSpotrebaBAR"></BarChart>
      </div>
      <div class="col">
        <MyBarChart @click="redukujPocet" :chartData=this.myDataNapatie :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col">
        <MyBarChart :chartData=this.myDataPrud :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col">
        <MyBarChart :chartData=this.myDataVoda :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col">
        <MyBarChart :chartData=this.myDataTlak :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col">
        <MyBarChart :chartData=this.myDataSobertVstup :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
      <div class="col">
        <MyBarChart :chartData=this.myDataSobertVykon :chartOptions=this.myOptionsTimeComp></MyBarChart>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>

import MyBarChart from './components/MyBarChart.vue'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import LineChartAPI from './components/LineChartAPI.vue'
import axios from 'axios'
import * as Helpers from "./helpers"
//import * as bootstrap from 'bootstrap'
//import 'bootstrap/scss/bootstrap.scss'




const KWH = 3600000;


export default {
  name: 'App',
  components: { MyBarChart, BarChart, LineChart, LineChartAPI, VueDatePicker },
  methods: {
    dajDataAPI() {

      this.inicializujOdDo();

      var URL = "https://192.168.1.71:7117/record/interval";
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
          this.spotreba_celkom = 0;
          Helpers.DodajSpotrebu(response.data);
          console.log("DATA SO SPOTREBOU: {0}", response.data);

          let PomLabels = ["ZMENA-1", "ZMENA-2", "ZMENA-3"]
          let PomData = PomLabels.map(zmenaa => {
            var total = 0;
            response.data.forEach(rec => (rec.zmena == zmenaa) && (total += rec.spotreba));
            this.spotreba_celkom += total / KWH;
            return total / KWH;
          })


          //console.log("total:{0}", PomData);
          this.myDataSpotrebaBAR = { labels: PomLabels, datasets: [{ data: PomData, label: "SPOTREBA ZMIEN [kWh]", backgroundColor: "#993333" }] }
          // --------------------------------------------------------------------------------------------------------------------------------------

          //CASOVA OS
          let reducedData = Helpers.RedukujPocetHodnot(response.data, 200);
          PomLabels = reducedData.map(rec => this.parsujDatum(rec.dateTime));
          this.TimeBoundary = Helpers.DodajKrajneHodnoty(new Date(PomLabels[0]), new Date(PomLabels[PomLabels.length - 1]));

          //VYKON
          PomData = reducedData.map(rec => rec.mojvykon);
          this.myDataVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "VYKON [W]", backgroundColor: "#33cc33" }] }

          //SPOTREBA
          PomData = reducedData.map(rec => rec.spotreba);
          this.myDataSpotreba = { labels: PomLabels, datasets: [{ data: PomData, label: "OKAMZITA SPOTREBA [Ws]", backgroundColor: "#ffbf00" }] }

          //NAPATIE
          PomData = reducedData.map(rec => rec.napatie);
          this.myDataNapatie = { labels: PomLabels, datasets: [{ data: PomData, label: "NAPATIE [V]", backgroundColor: "#f87979", borderColor: "#f87979" }] }

          //PRUD
          PomData = reducedData.map(rec => rec.prud);
          this.myDataPrud = { labels: PomLabels, datasets: [{ data: PomData, label: "PRUD [A]", backgroundColor: "#0066ff" }] }

          //TEPLOTA VODY
          PomData = reducedData.map(rec => rec.tVodaVstup);
          let PomData1 = reducedData.map(rec => rec.tVodaVystup);
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

        })
        .catch((error) => {
          console.error(error);
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
        case ('WEEK'): this.tDO = new Date(); this.tOD = Helpers.WeekBack(this.tDO); break;
        case ('MONTH'): this.tDO = new Date(); this.tOD = Helpers.MonthBack(this.tDO); break;
        case ('CUSTOM'): this.tDO = this.dpDO; this.tOD = this.dpOD; break;
      }
    }
  },
  computed: {

    myOptionsTimeComp() {
      return {
        scales: {
          x: {
            max: this.TimeBoundary.maxTime,//new Date("1970-01-01T02:00:00"),
            min: this.TimeBoundary.minTime,//new Date("1970-01-01T00:00:00"),
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
      }
    }
  },
  data() {
    const self = this;
    return {
      picked: "CUSTOM",
      spotreba_celkom: -999999,
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
      myDataVykon: {
        labels: [0],
        datasets: [{ data: [0], label: "VYKON [W]", backgroundColor: "#33cc33" }]
      },
      myDataSpotreba: {
        labels: [0],
        datasets: [{ data: [0], label: "OKAMZITA SPOTREBA [Ws]", backgroundColor: "#ffbf00" }]
      },

      myDataSpotrebaBAR: {
        labels: [0],
        datasets: [{ data: [0], label: "SPOTREBA ZMIEN [kWh]", backgroundColor: "#993333" }]
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
      myZmena: "VSETKY",
      myPec: "PEC_C"
    }
  }
}
</script>

<style scoped>
* {

  font-family: Arial, Helvetica, sans-serif;
}

.picker {
  /* margin-bottom: 10px; */
}

.spotreba-celkon {
  margin-bottom: -1.5rem;
  margin-top: 1rem;

}

/*
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}*/
</style>
