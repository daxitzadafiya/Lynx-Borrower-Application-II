<script setup>
import { defineEmits, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { loanPatch } from "@/mixins/loanPatch.js";

const emit = defineEmits(['setProgressVisibility']);
const route = useRoute();
const { saveAndAdvance } = loanPatch();

const setProgressVisibility = ({ name }) => {
   emit("setProgressVisibility", { name, step: 2 });
};

onMounted(()=>{
    setProgressVisibility({name:route.name})
});
</script>
<template>
  <div class="loan">
    <div class="main-header">
      <div class="header-title">Loan & Property</div>
    </div>
    <!-- <router-view @saveAndRedirect="({route}) => saveAndAdvance(true, route)"/> -->
    <router-view />
  </div>
</template>

<style scoped lang="scss">

.loan {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>