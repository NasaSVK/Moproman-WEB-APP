<script setup>

import MyBarChart from './MyBarChart.vue';
import EMT from '../main.js';
//import Emitter from "tiny-emiter";

</script>
<template>
   <div class="AHOJ">
      <!-- <slot name="trigger" v-on:click="test"></slot> -->
      <!-- <slot name="target"></slot> -->
      <!-- <button class="btn btn-info" ref="trigger"> Bootstrap modal </button> -->
      <div ref="target" class="modal" tabindex="-1">
         <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
               <div class="modal-body">
                  <MyBarChart :myChartData=pChartData :myChartOptions=pChartOptions ></MyBarChart>
               </div>
               <div class="modal-header">
                  <h5 class="modal-title">{{ dTitle }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.js"

export default {
   name: 'Modal',

   props: {
      pChartData: {
         type: Object,
         required: true
      },
      pChartOptions: {
         type: Object,
         default: {
            responsive: true,
            maintainAspectRatio: true,
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
   },
   data() {
      return {
         myDataMojVykon: {
            labels: [0],
            datasets: [{ data: [0], label: "POCITANY VYKON [W]", backgroundColor: "#33cc33" }]
         },
         dTitle: ""
      }
   },
   methods: {
      test() {
         { console.log("AHOJ") }
      }
   },

   created() {
      //this.$root.$refs.A = this;
      EMT.on('showModal', (title, data, options) => {

         this.dTitle = title;


         var theModal = new Modal(this.$refs.target, {})

         theModal.show()
      })
   },

   mounted() {
      //https://www.npmjs.com/package/tiny-emitter
      //https://stackoverflow.com/questions/67081494/how-can-i-emit-from-component-and-listen-from-another-one
      //https://stackoverflow.com/questions/41888464/how-to-update-one-component-from-another-component-in-vue-js

      //"TypeError: this.$root.$on is not a function"
      //vue.js - how to call method from another component

      //this.$root.$refs.A = this;
      //this.$root.$on('modalShow', () => {
      // your code goes here
      //this.c1method()
      //   this.$root.$refs.A = this;

      // var theModal = new Modal(this.$refs.target, {})
      // theModal.show()
      //});


      // this.$refs.trigger.addEventListener('click', () => {
      //     var theModal = new Modal(this.$refs.target, {})
      //     theModal.show()
      // });

      //var trigger = this.$slots.trigger()[0];
      //var target = this.$slots.target()[0];
      //trigger.addEventListener(('click', () => { return 0 }));

      // trigger.addEventListener('click', () => {
      //     var theModal = new Modal(target, {})
      //     theModal.show();
      //     //console.log("MODAL SHOWED");
      // })
   },
}
</script>

<style scoped>
.modal-dialog {
   width: 100%;
   height: auto;

}
</style>