<template>
    <Line @click="redukujPocet" :data="this.chartDataC" :options="this.chartOptionsC" />
</template>

<script lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

import { Line } from 'vue-chartjs'
import axios from "axios";

// import * as chartConfig from './chartConfig.js'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'LineChartAPI',
    components: {
        Line
    },
    methods:{
        redukujPocet(){
            console.log("CLICK");
            this.chartData.labels= [1,2,3,4],
            this.chartData.datasets = [{ data: [20,10,0,20] }]
            console.log(this.chartData.labels);
            
        }
    },
    data() {
        //return chartConfig
        return {
            chartData: {
                labels: [1,2,3,4,5,6],
                datasets: [{ data: [20,10,0,20,5,30] }]
            },
            chartOptions: {
                responsive: true
            },
            
            loaded: false
        }
    },

    computed: {
      chartDataC() { return this.chartData },
      chartOptionsC() { return this.chartOptions }
    },

    async mounted(){

        console.log("NAMONTOVANE");
        
        this.loaded = false;
        var URL = "https://localhost:7117/record/interval";    
        axios
        //.get("https://localhost:7117/record/interval?dateStart=2023-10-16T12:00:00&dateEnd=2023-10-16T19:15:00")
        .get(URL, {
          params: {            
            dateStart: "2023-10-16T12:00:00",
            dateEnd: "2023-10-16T19:15:00",
          },
        })
        
        .then((response) => {   
            //console.log(response);
            console.log(response.data.map(rec=>rec.napatie));
    
          this.chartData.labels = [1,2,3,4,5,6,7];
          this.chartData.datasets[0].data = [20,10,0,20,5,30,15];

          this.loaded = true;
        })
        .catch((error) => {
          
            console.error(error);
        });

    }
    
    

}

</script>