<template>
    <Bar id="my-chart-id" :options="cmpMyChartOptions" :data="pChartData" :plugins="this.plugin" />
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import * as dayjs from 'dayjs';
import {dajZaciatkyZmien as DZZ} from "../helpers";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, annotationPlugin)

export default {
    
    
    name: 'BarChart',
    components: { Bar, dayjs },
    data() {
        return {
            dAnnotations:[],
            
            chartData: {
                labels: ['January', 'February', 'March'],
                datasets: [{ data: [40, 20, 12], backgroundColor: "#ff3399", label: "SPOTREBA ZMIEN" }]
            },
            chartOptions: {
                responsive: true
            },

            plugin: [{
                id: 'customCanvasBackgroundColor',
                beforeDraw: (chart, args, options) => {
                    const { ctx, chartArea: { left, top, width, height } } = chart;
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.fillStyle = options.color || '#99ffff';
                    ctx.fillRect(left, top, width, height);
                    ctx.restore();
                }
            }]
        }
    },

    methods: {
        getAnnotations() {
          let arrCasy = this.pChartData.labels;
          let pOD = arrCasy[0];
          let pDO  = arrCasy[arrCasy.length-1];
          console.log("@@@ arrCasy:{0} @@@", arrCasy);
          let arrAnnotations = DZZ(pOD,pDO);
          console.log("@@@ pOD:{0} @@@", pOD);
          console.log("@@@ pDO:{0} @@@", pDO);
          console.log("@@@ arrAno:{0} @@@", arrAnnotations);
          return arrAnnotations;
        }
    },

    computed: {
        cmpMyChartOptions(){
            let newChartOptions =  this.myChartOptions;                        
            return newChartOptions;
        },        
        
    },
    
      
    props: {
        pChartData: {
            default: {
                labels: ['January', 'February', 'March'],
                datasets: [{ data: [40, 20, 12], backgroundColor: "#00bfff", label: "SPOTREBABAR" }]
            }
        },
        myChartOptions: {
            type: Object,
            default: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    customCanvasBackgroundColor: {
                        color: 'white',
                    },
                     annotation: {
                        annotations:[]
                        // annotations: 
                        // [
                        //     {
                        //         // Indicates the type of annotation
                        //         type: 'line',
                        //         xMin: -0.1,
                        //         xMax: -0.1,
                        //         yMin: 0,
                        //         yMax: 1,
                        //         borderColor: 'rgb(255, 99, 132)',
                        //         borderWidth: 3,
                        //     },                
                        //     {
                        //         // Indicates the type of annotation
                        //         type: 'line',
                        //         xMin: new Date("1970-01-01T00:01:00"),
                        //         xMax: new Date("1970-01-01T00:01:00"),
                        //         yMin: 0,
                        //         yMax: 5,
                        //         borderColor: 'rgb(255, 99, 132)',
                        //         borderWidth: 2,
                        //     },
                        //     {
                        //         // Indicates the type of annotation
                        //         type: 'line',
                        //         mode: 'vertical',                               
                        //         value: dayjs('1070-01-01T01:00:00').valueOf(),
                        //         borderColor: 'rgb(255, 99, 132)',
                        //         borderWidth: 1,
                        //         label: {
                        //         enabled: true,
                        //         position: "top",
                        //         content: "somelabel"
                        //         }
                        //     }
                        // ]
                    }
                }
                // title: {
                //     display: true,
                //     text: 'Custom Chart Title'
                // }
                //}]
            }
        }
    }
}
</script>
