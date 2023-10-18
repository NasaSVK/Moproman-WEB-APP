<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'MyBarChart',
  components: { Line },
  methods:{   
  },
  props: {
    
    label:{
        type: String,
        required: false,
        default:"Napatie"
    },
    pOd:{
      type:Date,
      default:new Date(2023,1,1)  
    },
    pDo:{
      type:Date,
      default:new Date(2023,12,31),
    },    
    chartData: {
        type: Object,
        required: true
      },
    chartOptions: {
      type: Object,
      default: { responsive: true, plugins: {
            title: {
                display: true,
                text: 'Custom Chart Title'
            }
        } }
    }
  }
}
</script>

  