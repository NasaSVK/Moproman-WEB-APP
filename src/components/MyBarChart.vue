<template>
  <Line id="my-chart-id1" :data="myChartData" :options="myChartOptions" :plugins="this.plugin" />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale } from 'chart.js'
import 'chartjs-adapter-moment';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale)

export default {
  name: 'MyBarChart',
  components: { Line },
  methods: {
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
    myChartData: {
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
          }
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
<style></style>

