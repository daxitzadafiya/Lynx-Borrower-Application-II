// <script setup>
// import { computed, onMounted } from 'vue';
// import { useGeneralStore } from '../../stores/generalStore';

// const generalStore = useGeneralStore();

// const type = computed(()=> generalStore.getAlertType());
// const message = computed(()=> generalStore.getAlertMessage());

// onMounted(async () => {
//   generalStore.setAlert({ isAlert: true })
// })
// </script>

// <template>
//   <div class="alert">
//     <v-alert
//       :type="type"
//       transition="scale-transition"
//     >
//       <template v-slot:append>
//         <v-btn
//           class="alert__close-button"
//           icon
//           @click="() => generalStore.setAlert({ isAlert: false })"
//         >
//           <v-icon
//             color="white"
//             mdi-close
//           ></v-icon>
          
//         </v-btn>
//       </template>
//       {{ message }}
//     </v-alert>
//   </div>
// </template>

// <style lang="scss" scoped>
// .alert {
//   z-index: 10000;
//   position: fixed;
//   top: 10px;
//   left: calc(-50vw + 50%);
//   right: calc(-50vw + 50%);
//   margin-left: auto;
//   margin-right: auto;
//   max-width: 340px;
//   &__close-button {
//     max-height: 24px;
//     max-width: 24px;
//   }
// }
// </style>
