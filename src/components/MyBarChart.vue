<template>
  <Line id="my-chart-id1" :data="pChartData" :options="cmpMyChartOptions" :plugins="this.plugin" />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale } from 'chart.js'
import 'chartjs-adapter-moment';
import {dajZaciatkyZmien as DZZ} from "../helpers";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale)

export default {
  name: 'MyBarChart',
  components: { Line },
  methods: {
    getAnnotations() {
          let arrCasy = this.pChartData.labels;
          if (!arrCasy) return [];
          let pOD = arrCasy[0];
          let pDO  = arrCasy[arrCasy.length-1];
          let zaciatkyZmien = DZZ(new Date(pOD), new Date(pDO));
          let arrAnnotations = [];
          //console.log("@@@ arrCasy:", arrCasy);console.log("@@@ pOD:", pOD);console.log("@@@ pDO:", pDO);          
          for(let zmenaDate of zaciatkyZmien){
              let newANNOTATION =  { type: 'line',                                                                                    
                                      xMin: zmenaDate,
                                      xMax: zmenaDate,                                                                
                                      bqorderColor: 'rgb(255, 99, 132, 0.6)',
                                      borderWidth: 1};
                     
               arrAnnotations.push(newANNOTATION);
         }
          //console.log("@@@ arrAno:", arrAnnotations);
          return arrAnnotations;
        }
  },

  computed: {
    cmpMyChartOptions(){                        
                  let plugins= {
                    
                    customCanvasBackgroundColor: {
                    color: 'white',
                      },
                      annotation: {
                                  drawTime: 'afterDatasetsDraw',
                                  annotations: this.getAnnotations()
                                }
                        }              
                      this.myChartOptions.plugins = plugins;                           
                    return this.myChartOptions;
      } 
    },

    data() {
      return {
        plugin: [{
          id: 'customCanvasBackgroundColor',
          beforeDraw: (chart, args, options) => {
            const { ctx, chartArea: { left, top, width, height } } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = options.color || '#99ffff';
            //ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.fillRect(left, top, width, height);
            ctx.restore();
          }
        }]
      }
  },

  props: {

    label: {
      type: String,
      required: false,
      default: "Napatie"
    },
    pOd: {
      type: Date,
      default: new Date(2023, 1, 1)
    },
    pDo: {
      type: Date,
      default: new Date(2023, 12, 31),
    },
    pChartData: {
      type: Object,
      required: true
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
                        drawTime: 'afterDatasetsDraw',
                        annotations: []
                }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: "day"
            }
          }
        }
      }
    }
  }
}
</script>
<style></style>

