<template>
    <Bar id="my-chart-id" :options="myChartOptions" :data="myChartData" :plugins="this.plugin" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    data() {
        return {
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

    props: {
        myChartData: {
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
