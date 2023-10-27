<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
</script>
<!-- <div>safafs</div> -->
<template>
  <!-- <div>Picked: {{ picked }}</div> -->
  <!-- <h1>PEC B</h1>     -->
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


  <VueDatePicker class="picker" v-model="tOD">AHOJ1</VueDatePicker>
  <VueDatePicker class="picker" v-model="tDO">AHOJ2</VueDatePicker>
  <button v-on:click="dajDataAPI">ZOBRAZ DATA</button>
  <div>{{ this.maxTime }}</div>
  <MyBarChart :chartData=this.myDataVykon :chartOptions=this.myOptionsTimeComp></MyBarChart>
  <MyBarChart :chartData=this.myDataSpotreba :chartOptions=this.myOptionsTimeComp></MyBarChart>
  <BarChart :chartData="this.myDataSpotrebaBAR"></BarChart>
  <MyBarChart @click="redukujPocet" :chartData=this.myDataNapatie :chartOptions=this.myOptionsTimeComp></MyBarChart>
  <MyBarChart :chartData=this.myDataPrud :chartOptions=this.myOptionsTimeComp></MyBarChart>
  <MyBarChart :chartData=this.myDataVoda :chartOptions=this.myOptionsTimeComp></MyBarChart>
</template>

<script>

import MyBarChart from './components/MyBarChart.vue'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import LineChartAPI from './components/LineChartAPI.vue'
import axios from 'axios'
import * as Helpers from "./helpers"


export default {
  name: 'App',
  components: { MyBarChart, BarChart, LineChart, LineChartAPI, VueDatePicker },
  methods: {
    // redukujPocet() {
    //   this.myDataNapatie = { labels: [1, 2, 3, 4], datasets: [{ data: [20, 10, 0, 20] }] }
    //   console.log(this.myDataNapatie);
    // },
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
          },
        })

        .then((response) => {

          // SPOTREBA ZMIEN
          Helpers.DodajSpotrebu(response.data);
          console.log("DATA SO SPOTREBOU: {0}", response.data);

          let PomLabels = ["ZMENA-1", "ZMENA-2", "ZMENA-3"]
          let PomData = PomLabels.map(zmenaa => {
            var total = 0;
            response.data.forEach(rec => (rec.zmena == zmenaa) && (total += rec.spotreba));
            return total;
          })
          //console.log("total:{0}", PomData);
          this.myDataSpotrebaBAR = { labels: PomLabels, datasets: [{ data: PomData, label: "SPOTREBA ZMIEN", backgroundColor: "#993333" }] }


          //CASOVA OS
          let reducedData = Helpers.RedukujPocetHodnot(response.data, 200);
          PomLabels = reducedData.map(rec => this.parsujDatum(rec.dateTime));
          this.TimeBoundary = Helpers.DodajKrajneHodnoty(new Date(PomLabels[0]), new Date(PomLabels[PomLabels.length - 1]));

          //VYKON
          PomData = reducedData.map(rec => rec.mojvykon);
          this.myDataVykon = { labels: PomLabels, datasets: [{ data: PomData, label: "VYKON", backgroundColor: "#33cc33" }] }

          //SPOTREBA
          PomData = reducedData.map(rec => rec.spotreba);
          this.myDataSpotreba = { labels: PomLabels, datasets: [{ data: PomData, label: "SPOTREBA", backgroundColor: "#ffbf00" }] }

          //NAPATIE
          PomData = reducedData.map(rec => rec.napatie);
          this.myDataNapatie = { labels: PomLabels, datasets: [{ data: PomData, label: "NAPATIE", backgroundColor: "#f87979", borderColor: "#f87979" }] }

          //PRUD
          PomData = reducedData.map(rec => rec.prud);
          this.myDataPrud = { labels: PomLabels, datasets: [{ data: PomData, label: "PRUD", backgroundColor: "#0066ff" }] }

          //TEPLOTA VODY
          PomData = reducedData.map(rec => rec.tVodaVstup);
          let PomData1 = reducedData.map(rec => rec.tVodaVystup);
          this.myDataVoda = { labels: PomLabels, datasets: [{ data: PomData, label: "VODA VSTUP", backgroundColor: "#9933ff" }, { data: PomData1, label: "VODA VYSTUP", backgroundColor: "#ff6600" }] }

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
        case ('WEEK'): this.DO = new Date(); this.tOD = Helpers.WeekBack(this.DO); break;
        case ('MONTH'): this.DO = new Date(); this.tOD = Helpers.MonthBack(this.DO); break;
        case ('CUSTOM'): this.DO = this.DO; this.tOD = this.tOD; break;
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

      tDO: new Date(),
      //tOD: new Date() - 30 * 60 * 1000, //odcitavaju sa MINUTY
      //tOD: new Date().setMinutes(new Date().getMinutes() - 30),
      tOD: new Date().setHours(new Date().getHours() - 4),

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
        datasets: [{ data: [0], label: "SPOTREBA [kWh]", backgroundColor: "#ffbf00" }]
      },

      myDataSpotrebaBAR: {
        labels: [0],
        datasets: [{ data: [0], label: "SPOTREBA_ZMIEN [kWh]", backgroundColor: "#993333" }]
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
      myDataVoda: {
        labels: [0],
        datasets: [{ data: [0], label: "VODA VSTUP [°C]", backgroundColor: "#9933ff" }, { data: [0], label: "VODA VYSTUP [°C]", backgroundColor: "#ff6600" }]
      }

    }
  }
}
</script>

<style scoped>
* {

  font-family: Arial, Helvetica, sans-serif;
}

.picker {
  margin-bottom: 10px;
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
