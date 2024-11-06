<script setup>
import moment from "moment";
import { computed, onMounted, ref, defineProps } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useDisplay } from 'vuetify'

const borrowersStore = useBorrowersStore();

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

const { sm, lg } = useDisplay()
const selectedBorrower = ref("");
const selectedBorrowerId = ref("");
const counselingTypes = ref([
  { text: "Counseling", value: "Counseling" },
  { text: "Education", value: "Education" },
]);
const formatTypes = ref([
  { text: "Face To Face", value: "FaceToFace" },
  { text: "Internet", value: "Internet" },
  { text: "Telephone", value: "Telephone" },
]);
const menus = ref([]);
const additional = ref(null);

const setBorrower = (value) => {
  selectedBorrower.value = value;
  const index = borrowersNames.value.findIndex((item) => item === value);
  selectedBorrowerId.value = props.borrowers[index].Id;
};
const addParty = () => {
  if (additional.value) return;
  additional.value = {};
};

const formattedDate = (event) => {
  return event.CounselingCompletedDate
    ? moment(new Date(event.CounselingCompletedDate)).format("DD/MM/YYYY")
    : "";
};

const setDate = (date, index) => {
  const formatted = moment(new Date(date)).format("YYYY-MM-DD");
  setUpdatedBorrowers("CounselingCompletedDate", formatted, index);
  menus.value[index] = false;
};

const setUpdatedBorrowers = (prop, value, index) => {
  const updatedBorrowers = props.borrowers.map((item) => {
    let CounselingEvents = item.CounselingEvents || [];
    if (item.Id === selectedBorrowerId.value) {
      CounselingEvents[index] = CounselingEvents.length
        ? { ...CounselingEvents[index], [prop]: value }
        : { [prop]: value };
      item.CounselingEvents = CounselingEvents;
    }
    return item;
  });
  borrowersStore.updateBorrowers(updatedBorrowers);
  additional.value = null;
};

const removeEvent = (index) => {
  const updatedBorrowers = props.borrowers.map((item) => {
    item.CounselingEvents = item.CounselingEvents.filter((el, i) => i !== index);
    return item;
  });
  borrowersStore.updateBorrowers(updatedBorrowers);
};

const borrowersNames = computed(() => {
  return props.borrowers && props.borrowers.length
    ? props.borrowers.map((item) => `${item.FirstName} ${item.LastName}`)
    : [];
});

const partiesData = computed(() => {
    return props.parties && props.parties.length
    ? props.parties.map((item) => {
        return { text: item.FullName, value: item.PartyRoleIdentifier };
    })
    : [];
});
const cols = computed(() => {
  return lg.value ? [3, 3]
        :sm.value ? [4, 4, 4]
       : [12, 12, 12, 10, 2]
})

const events = computed(() => {
  if (props.borrowers && props.borrowers.length) {
    return props.borrowers.reduce((acc, cur) => {
      return cur.CounselingEvents ? [...acc, ...cur.CounselingEvents] : [...acc];
    }, []);
  }
  return [];
});

onMounted(() => {
  selectedBorrower.value = borrowersNames.value[0] || "";
  selectedBorrowerId.value = props.borrowers[0] ? props.borrowers[0].Id : "";
});

const getDateObject = (dateStr) => {
  return dateStr ? new Date(dateStr) : null;
};
</script>
<template>
  <v-card class="mt-3" variant="outlined">
    <v-card-title>Events</v-card-title>
    <v-card-text>
      <v-row class="align-center">
        <v-col :sm="3">
          <v-select
            light
            :items="borrowersNames"
            label="Borrower"
            :model-value="selectedBorrower"
            @update:model-value="(value) => setBorrower(value)"
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            variant="underlined"
          />
        </v-col>
      </v-row>

      <v-row class="align-start  flex-md-nowrap" v-for="(event, index) in events" :key="index">
        <v-col :md="3" :cols="cols[0]" class="py-0 py-sm-3">
          <v-select
            light
            :items="partiesData"
            item-title="text"
            item-value="value"
            label="Counseling Party"
            :model-value="event.CounselingPartyRoleIdentifier"
            @update:model-value="
              (value) =>
                setUpdatedBorrowers('CounselingPartyRoleIdentifier', value, index)
            "
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            variant="underlined"
          />
        </v-col>
        <v-col :md="3" :cols="cols[0]" class="py-0 py-sm-3">
          <v-select
            light
            :items="counselingTypes"
            item-title="text"
            item-value="value"
            label="Counseling Type"
            :model-value="event.CounselingType"
            @update:model-value="
              (value) => setUpdatedBorrowers('CounselingType', value, index)
            "
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            variant="underlined"
          />
        </v-col>
        <v-col :md="3" :cols="cols[2]" class="py-0 py-sm-3">
          <v-select
            light
            :items="formatTypes"
            item-title="text"
            item-value="value"
            label="Counseling Format"
            :model-value="event.CounselingFormatType"
            @update:model-value="
              (value) => setUpdatedBorrowers('CounselingFormatType', value, index)
            "
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            variant="underlined"
          />
        </v-col>
        <v-col :md="2" :cols="cols[3]">
          <v-menu
            light
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            v-model="menus[index]"
          >
            <template #activator="{ props }">
              <v-text-field
                light
                label="Completion Date Format"
                :model-value="formattedDate(event)"
                prepend-icon="mdi-calendar-range"
                readonly
                class="input-field"
                v-bind="props"
                style="max-width: 300px !important"
                hide-details
                variant="underlined"
              />
            </template>
            <v-date-picker
              color="primary"
              variant="underlined"
              light
              :model-value="getDateObject(event.CounselingCompletedDate)"
              @update:model-value="(date) => setDate(date, index)"
            />
          </v-menu>
        </v-col>
        <v-col class="d-flex align-center pl-0 pl-sm-3 justify-end justify-lg-start" :md="1" :cols="cols[4]">
          <div class="d-flex align-end h-50">
            <v-icon
              class="red--text no-background-active"
              style="cursor: pointer"
              @click="removeEvent(index)"
              :ripple="false"
            >
              mdi-delete
            </v-icon>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="additional" class="align-start">
        <v-col :md="3" :cols="cols[0]" class="py-0 py-sm-3">
          <v-select
            light
            :items="partiesData"
            item-title="text"
            item-value="value"
            label="Counseling Party"
            :model-value="additional.CounselingPartyRoleIdentifier"
            @update:model-value="
              (value) =>
                setUpdatedBorrowers('CounselingPartyRoleIdentifier', value, events.length)
            "
            :menu-props="{ light: true, bottom: true, offsetY: true }"
           
            variant="underlined"
          />
        </v-col>
        <v-col :md="3" :cols="cols[0]" class="py-0 py-sm-3">
          <v-select
            light
            :items="counselingTypes"
            item-title="text"
            item-value="value"
            label="Counseling Type"
            :model-value="additional.CounselingType"
            @update:model-value="
              (value) => setUpdatedBorrowers('CounselingType', value, events.length)
            "
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            variant="underlined"
          />
        </v-col>
        <v-col :md="3" :cols="cols[2]" class="py-0 py-sm-3">
          <v-select
            light
            :items="formatTypes"
            item-title="text"
            item-value="value"
            label="Counseling Format"
            :model-value="additional.CounselingFormatType"
            @update:model-value="
              (value) => setUpdatedBorrowers('CounselingFormatType', value, events.length)
            "
            :menu-props="{ light: true, bottom: true, offsetY: true }"
            variant="underlined"
          />
        </v-col>
        <v-col :md="2" :cols="cols[3]">
          <v-menu
            light
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            v-model="additional.isMenu"
          >
            <template #activator="{ props }">
              <v-text-field
                light
                label="Completion Date Format"
                :model-value="formattedDate(additional)"
                prepend-icon="mdi-calendar-range"
                readonly
                class="input-field"
                v-bind="props"               
                hide-details
                variant="underlined"
              />
            </template>
            <v-date-picker
              color="primary"
              variant="underlined"
              light
              :model-value="getDateObject(additional.CounselingCompletedDate)"
              @update:model-value="(date) => setDate(date, events.length)"
            />
          </v-menu>
        </v-col>
        <v-col class="d-flex align-lg-start align-end flex-column pl-0 pl-sm-3" :md="1" :cols="cols[4]">
          <div class="d-flex align-end h-50">
            <v-icon
              class="red--text no-background-active"
              style="cursor: pointer"
              @click="additional = null"
              :ripple="false"
            >
              mdi-delete
            </v-icon>
          </div>         
        </v-col>
      </v-row>
      <v-row class="ma-0 pa-0 mb-3 mt-3 mt-md-0">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addParty"
        >
        <v-icon small="small">mdi-plus</v-icon>
          <span class="addBtnText">Add Counseling Party</span>
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
    padding-left: 0px !important;
    min-height: 9px; 
    font-size: 13px !important;
    padding-bottom: 3px !important;
    letter-spacing: normal !important;
  }
  .v-field--active{
    // input{
    // padding-bottom: 6px !important;
    // }
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
  .v-field{
    height: 50px !important;
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
    padding-top: 14px !important;
  }
  .v-field--active{
    label {
      font-size: 9.9px !important;
      letter-spacing: normal !important;
      color: $black !important;
      opacity : 1;
    }
    .v-field__append-inner{
      padding-top: 19px !important;
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
.h-50{
  height: 50px !important;
}
</style>
