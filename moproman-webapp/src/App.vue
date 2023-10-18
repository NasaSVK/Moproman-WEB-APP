<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
</script>

<template>
    <h1>PEC B</h1>
    <VueDatePicker class="picker" v-model="tOD"></VueDatePicker>
    <VueDatePicker class="picker" v-model="tDO"></VueDatePicker>
    <button v-on:click="dajDataAPI">ZOBRAZ DATA</button>
    
    
    <MyBarChart @click="redukujPocet" :chartData=this.myDataNapatie ></MyBarChart>
    <MyBarChart :chartData=this.myDataPrud ></MyBarChart>
    <MyBarChart :chartData=this.myDataVoda ></MyBarChart>
    
    
    <!-- <LineChartAPI></LineChartAPI>
    <BarChart />
    <LineChart></LineChart>-->
</template>

<script>

import MyBarChart from './components/MyBarChart.vue'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import LineChartAPI from './components/LineChartAPI.vue'
import axios from 'axios'


export default {
  name: 'App',
  components: { MyBarChart, BarChart, LineChart, LineChartAPI, VueDatePicker },
  methods:{
    redukujPocet(){
            this.getData();
            console.log("CLICK");
            this.myDataNapatie = {labels:[1,2,3,4], datasets:[{ data: [20,10,0,20] }]}        
            console.log(this.myDataNapatie);              
        },
    dajDataAPI(){
        var URL = "https://192.168.45.1:7117/record/interval";    
        // var pOD = this.parsujDatum(this.tOD);
        // var pDO = this.parsujDatum(this.tDO);
        // console.log("OD="+pOD + "   DO="+pDO);
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
          
            //console.log(response.data.map(rec=>rec.napatie));
            let PomLabels  =   response.data.map(rec=>this.parsujDatumForLabels(rec.dateTime));
            let PomData  =   response.data.map(rec=>rec.napatie);
            this.myDataNapatie = {labels:PomLabels, datasets:[{data:PomData, label: "NAPATIE", backgroundColor: "#f87979", borderColor: "#f87979"}]}

            PomData  =   response.data.map(rec=>rec.prud);
            this.myDataPrud = {labels:PomLabels, datasets:[{data:PomData, label: "PRUD", backgroundColor: "#0066ff"}]}
                      
            PomData  =   response.data.map(rec=>rec.tVodaVstup);
            let PomData1  =   response.data.map(rec=>rec.tVodaVystup);
            this.myDataVoda = {labels:PomLabels, datasets:[{data:PomData, label: "VODA VSTUP", backgroundColor: "#9933ff"}, {data:PomData1, label: "VODA VYSTUP", backgroundColor: "#ff6600"}]}

        })
        .catch((error) => {      
            console.error(error);
        });},

    
    
    getData() {
      console.log(this.tOD + "  " + this.tDO + " " + this.parsujDatum(this.tOD) + " " + this.parsujDatum(this.tDO));
    },
    parsujDatum(pDatum) {

      return moment(pDatum).format("YYYY-MM-DDTHH:mm:ss");
  
    },
    parsujDatumForLabels(pDatum) {
      return moment(pDatum).format("DD.MM. - HH:mm:ss");
    }
  
    
  },
  data() {
    const self = this;
    return {      
      tDO: new Date(),
      //tOD: new Date() - 30 * 60 * 1000,
      //tOD: new Date().setMinutes(new Date().getMinutes() - 30),      
      tOD: new Date().setHours(new Date().getHours() - 4),      
      
      myDataNapatie: {
         //labels: [ 'January', 'February', 'March' ],
         //datasets: [ { data: [40, 20, 12] } ]
        labels: [0],
        datasets: [ { data: [0], label: "NAPATIE", backgroundColor: "#f87979" }]
      },
      myDataPrud: {
        labels: [0],
        datasets: [ { data: [0], label: "PRUD", backgroundColor: "#0066ff" }]
      },
      myDataVoda: {
        labels: [0],
        datasets: [ { data: [0], label: "VODA VSTUP",backgroundColor: "#9933ff" }, { data: [0], label: "VODA VYSTUP",backgroundColor: "#ff6600" }]
      }
    }
}
}
</script>

<style scoped>
*{

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
