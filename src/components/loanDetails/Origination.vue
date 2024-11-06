<script setup>
import { ref } from "vue";
import Organization from "@/components/loanDetails/originations/Organization.vue";
import Originator from "@/components/loanDetails/originations/Originator.vue";
import FhaLoans from "@/components/loanDetails/originations/FhaLoans.vue";

const items = ref([
  { title: "Organization" },
  { title: "Originator" },
  { title: "FHA Loans" },
]);
const open = ref(["Organization"]);

const onItemClick = (title) => {
  if (open.value.includes(title)) {
    open.value = [];
  } else {
    open.value = [title];
  }
};
</script>

<template>
  <v-card class="origination" light>
    <v-card-title class="p-4">Origination</v-card-title>
    <v-card-text>
      <v-list :opened="open">
        <v-list-group v-for="(item, index) in items" :key="index" :value="item.title" >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" @click="onItemClick(item.title)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item v-if="item.title === 'Organization'" :ripple="false">
            <Organization />
          </v-list-item>

          <v-list-item v-if="item.title === 'Originator'" :ripple="false">
            <Originator />
          </v-list-item>

          <v-list-item v-if="item.title === 'FHA Loans'" :ripple="false">
            <FhaLoans />
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
:deep(.v-list-item--active) {
  color: $primary;
  &:hover {
    background: $light-blue;
    color: $primary;
  }
}
.p-4 {
  padding: 16px;
}
.v-list-item-title{
  letter-spacing: normal;
}
:deep(.v-list-item__append){
  i{
    font-size: 24px !important;
  }
}

:deep(.v-list-group__items){
  .v-list-item{
    padding-left: 72px !important;
    @media(max-width:$lg-desktop-width){
      padding-left: 30px !important;
    }
    @media(max-width:$lg-desktop-width){
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  }
}
</style>
