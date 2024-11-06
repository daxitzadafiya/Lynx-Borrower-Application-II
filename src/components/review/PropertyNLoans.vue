<script setup>
import SubjectProperty from "@/components/review/SubjectProperty.vue";
import LoanDetails from "@/components/review/LoanDetails.vue";

</script>
<template>
  <v-card-text class="text-block p-6">
    <v-row>
      <v-col md="6" cols="12">
        <SubjectProperty />
      </v-col>
      <v-col md="6" cols="12">
        <LoanDetails />
      </v-col>
    </v-row>
  </v-card-text>
</template>

<style lang="scss" scoped>
.p-6{
  padding: 19px 30px !important;
}

@media (max-width: $sm-tablet-width){
  .p-6{
    padding: 0px !important;
}
}
</style>
