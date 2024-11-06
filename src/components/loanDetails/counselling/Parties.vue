<script setup>
import { ref, defineProps, computed } from "vue";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useDisplay } from 'vuetify'

const lenderInfoStore = useLenderInfoStore();
const { sm } = useDisplay()

const additional = ref(null);
const types = ref([
  {
    text: "Housing Counseling Agency",
    value: "HousingCounselingAgency",
  },
  {
    text: "Other",
    value: "Other",
  },
]);

const props = defineProps({
  parties: {
    type: Array,
    default: () => [],
  },
  borrowers: {
    type: Array,
    default: () => [],
  },
});

const cols = computed(() => {
  return sm.value ? [3, 3]
       : [12, 12, 10, 2]
})

const updateParty = (prop, value, index) => {
  const counselingParties = props.parties.map((item, i) => {
    if (i === index) {
      item[prop] = value;
    }
    return item;
  });
  lenderInfoStore.updateCounselingParties(counselingParties);
};

const addNewParty = (prop, value) => {
  const counselingParties = [...props.parties, { [prop]: value }];
  lenderInfoStore.updateCounselingParties(counselingParties);
  additional.value = null;
};

const removeParty = (index) => {
  const counselingParties = props.parties.filter((item, i) => i !== index);
  lenderInfoStore.updateCounselingParties(counselingParties);
};

const partyRoleIdentifiers = computed(() => {
  if (props.borrowers && props.borrowers.length) {
    return props.borrowers.reduce((acc, cur) => {
      let identifiers = [];
      if (cur.CounselingEvents) {
        identifiers = cur.CounselingEvents.map(
          (item) => item.CounselingPartyRoleIdentifier
        );
      }
      return [...acc, ...identifiers];
    }, []);
  }
  return [];
});
</script>
<template>
  <v-card variant="outlined" elevation="0">
    <v-card-title>Parties</v-card-title>
    <v-card-text>
      <v-row class="align-baseline -mt-17" v-for="(party, index) in parties" :key="index">
        <v-col :md="3" :cols="cols[0]" class="py-0 py-sm-3">
          <v-text-field
            class="input-field"
            variant="underlined"
            label="Counseling Party Name"
            :model-value="party.FullName"
            @input="(e) => updateParty('FullName', e.target.value, index)"
          />
        </v-col>
        <v-col :md="3" :cols="cols[0]" class="py-0 py-sm-3">
          <v-text-field
            variant="underlined"
            class="input-field"
            label="Counseling Party Identifier"
            :model-value="party.PartyRoleIdentifier"
            @input="(value) => updateParty('PartyRoleIdentifier', e.target.value, index)"
          />
        </v-col>
        <v-col :md="3" :cols="cols[2]" class="py-0 py-sm-3">
          <v-select
            variant="underlined"
            light
            :items="types"
            label="Counseling Party Type"
            item-title="text"
            item-value="value"
            :model-value="party.PartyRoleType"
            @update:model-value="(value) => updateParty('PartyRoleType', value, index)"
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            style="max-width: 300px;  margin-top:-6px"
          />
        </v-col>
        <v-col :md="2" :cols="cols[3]"
          class="d-flex justify-lg-start justify-end pl-0 pl-sm-3 py-0 py-sm-3"
          v-if="partyRoleIdentifiers.indexOf(party.PartyRoleIdentifier) === -1"
        >
          <v-icon
            class="red--text no-background-active"
            style="cursor: pointer"
            @click="removeParty(index)"
            >mdi-delete</v-icon
          >
        </v-col>
      </v-row>
      <v-row v-if="additional">
        <v-col cols="3">
          <v-text-field
            variant="underlined"
            label="Counseling Party Name"
            class="input-field"
            @input="(e) => addNewParty('FullName', e.target.value)"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            variant="underlined"
            class="input-field"
            label="Counseling Party Identifier"
            @input="(e) => addNewParty('PartyRoleIdentifier', e.target.value)"
          />
        </v-col>
        <v-col cols="3">
          <v-select
            variant="underlined"
            light
            :items="types"
            label="Counseling Party Type"
            item-title="text"
            item-value="value"
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            @update:model-value="(value) => addNewParty('PartyRoleType', value)"
            style="max-width: 300px; margin-top:-6px"
          />
        </v-col>
        <v-col class="d-flex">
          <v-icon
            class="red--text no-background-active"
            style="cursor: pointer"
            @click="additional = null"
            :ripple="false"
          >
            mdi-delete
          </v-icon>
        </v-col>
      </v-row>
      <v-row class="ma-0 pa-0 mb-3">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addNewParty"
        >
        <v-icon small="small">mdi-plus</v-icon>
          <span class="addBtnText">Add Counseling Party </span>
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.red--text{
  color: $red !important;
  font-size: 24px !important;
}
.v-card{
  border: 1px solid #0000001f;
  .v-card-title{
    padding: 16px;
  }
}
:deep(.input-field) {
  label {
      letter-spacing: normal !important;
  }
  input {
    margin: 7px 4px 0px 0px;
    padding-left: 6px !important;
    min-height: 9px; 
    font-size: 13px !important;
    padding-bottom: 6px !important;
    letter-spacing: normal !important;
  }
  .v-field--active{
    label {
      font-size: 9.9px !important;
      letter-spacing: normal !important;
      color: $black !important;
      opacity : 1;
    }
  }
}
.ls-1 {
  letter-spacing: 0.1px !important;
  line-height: 22px !important;
}
:deep(.v-select) {
  label {
      letter-spacing: normal !important;
  }
  .v-field__input {
    margin: 5px 4px 0px 0px;
    padding-left: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
    letter-spacing: normal !important;
  }
  .v-field__append-inner{
    margin: 4px 4px 0px 0px;
    min-height: 23px;
    padding-top: 19px !important;
  }
  .v-field--active{
    label {
      font-size: 9.9px !important;
      letter-spacing: normal !important;
      color: $black !important;
      opacity : 1;
    }
    .v-field__input {
      padding-bottom: 10px !important;
    }
  }
}
.font-weight-medium {
  color: #00000099 !important;
}
.button{
  margin: 40px 0 15px 0px;
}
.-mt-17{
  margin-top: -17px;
}
:deep(.v-field.v-field--active .v-label.v-field-label--floating){
    transform: translateY(-8px) !important;
}
.addItemBtn{
  padding-left: 8px !important;
  margin-top: 5px !important;
}
.mb-3{
  margin-bottom: 3px !important;
}
</style>
