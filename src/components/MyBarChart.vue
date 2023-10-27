<scrip setup>

</scrip>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import { Chart, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale } from 'chart.js'
import 'chartjs-adapter-moment';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale)

export default {
  name: 'MyBarChart',
  components: { Line },
  methods: {
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
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: {
        responsive: true, plugins: {
          // title: {
          //     display: true,
          //     text: 'Custom Chart Title'
          // }
        },
        scales: {
          x: {
            //min: '2021-11-01T00:00:00',
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

