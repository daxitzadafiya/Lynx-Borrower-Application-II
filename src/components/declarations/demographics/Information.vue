<script setup>
import { computed, ref, defineProps } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const borrowersStore = useBorrowersStore();
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: true,
  },
});
const ethnicityOptions = ref([
  "Hispanic Or Latino",
  "Not Hispanic Or Latino",
  "I do not wish to provide this information",
]);
const ethnicGroups = ref(["Cuban", "Mexican", "Puerto Rican", "Other"]);
const sexOptions = ref(["Male", "Female", "I do not wish to provide this information"]);
const country = ref(["United States"]);
const race = ref("Native Hawaiian or Other Pacific Islander");
const raceOptions = ref({
  AmericanIndianOrAlaskaNative: null,
  Asian: [
    "AsianIndian",
    "Chinese",
    "Filipino",
    "Japanese",
    "Korean",
    "Vietnamese",
    "OtherAsian",
  ],
  BlackOrAfricanAmerican: null,
  NativeHawaiianOrOtherPacificIslander: [
    "GuamanianOrChamorro",
    "NativeHawaiian",
    "Samoan",
    "OtherPacificIslander",
  ],
  White: null,
});
const additional = ref(null);

const setEthnicity = (option) => {
  const clearedVal = option ? option.replace(/ /g, "") : "";
  let Demographics = { ...demographics.value };
  if (option === "I do not wish to provide this information") {
    Demographics.HMDAEthnicityRefusalIndicator = true;
    delete Demographics.Ethnicities;
  } else {
    let Ethnicities = [{ ...ethnicities.value[0], ULADHMDAEthnicityType: clearedVal }];
    const EthnicitiyOrigins = [
      {
        ...ethnicityOrigins.value[0],
        HMDAEthnicityOriginType: "",
        HMDAEthnicityOriginTypeOtherDescription: "",
      },
    ];
    Demographics = {
      ...demographics.value,
      HMDAEthnicityRefusalIndicator: false,
      Ethnicities,
      EthnicitiyOrigins,
    };
  }
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setEthnicityOrigin = (option) => {
  const clearedVal = option ? option.replace(/ /g, "") : "";
  let EthnicitiyOrigins = [
    { ...ethnicityOrigins.value[0], HMDAEthnicityOriginType: clearedVal },
  ];
  if (option !== "Other") {
    delete EthnicitiyOrigins[0].HMDAEthnicityOriginTypeOtherDescription;
  }
  const Demographics = { ...demographics.value, EthnicitiyOrigins };
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setEthnicityOtherOrigin = (value) => {
  const EthnicitiyOrigins = [
    {
      ...ethnicityOrigins.value[0],
      HMDAEthnicityOriginTypeOtherDescription: value,
    },
  ];
  const Demographics = { ...demographics.value, EthnicitiyOrigins };
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setSex = (option) => {
  let Demographics = { ...demographics.value };
  if (option === "I do not wish to provide this information") {
    Demographics.HMDAGenderRefusalIndicator = true;
    delete Demographics.ULADHMDAGenderType;
  } else {
    Demographics.ULADHMDAGenderType = option;
    Demographics.HMDAGenderRefusalIndicator = false;
  }
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setRaceRefusal = (value) => {
  let Demographics = {
    ...demographics.value,
    HMDARaceRefusalIndicator: value,
  };
  delete Demographics.Races;
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setRaceType = (raceType, index) => {
  const clearedVal = raceType ? raceType.replace(/ /g, "") : "";
  let Races = races.value.length ? [...races.value] : [{ HMDARaceType: "" }];
  Races[index] = { HMDARaceType: clearedVal };
  let Demographics = {
    ...demographics.value,
    HMDARaceRefusalIndicator: false,
    Races,
  };
  additional.value = null;
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setRaceOrigin = (origin, index) => {
  const clearedVal = origin ? origin.replace(/ /g, "") : "";
  let Races = [...races.value];
  Races[index].ULADHMDARaceDesignationType = clearedVal;
  let Demographics = {
    ...demographics.value,
    HMDARaceRefusalIndicator: false,
    Races,
  };
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const setOtherRaceOrigin = (val, index) => {
  let Races = [...races.value];
  const prop =
    Races[index].ULADHMDARaceDesignationType === "OtherAsian"
      ? "ULADHMDARaceDesignationOtherAsianDescription"
      : "ULADHMDARaceDesignationOtherPacificIslanderDescription";
  Races[index][prop] = val;
  let Demographics = { ...demographics.value, Races };
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const getEthnicity = () => {
  if (demographics.value.HMDAEthnicityRefusalIndicator) {
    return "I do not wish to provide this information";
  }
  return !ethnicities.value[0]
    ? ""
    : ethnicities.value[0].ULADHMDAEthnicityType
    ? ethnicities.value[0].ULADHMDAEthnicityType.replace(/([a-z])([A-Z])/g, "$1 $2")
    : "";
};

const getEthnicOriginTypeValue = () => {
  return !ethnicityOrigins.value[0]
    ? ""
    : ethnicityOrigins.value[0].HMDAEthnicityOriginType
    ? ethnicityOrigins.value[0].HMDAEthnicityOriginType.replace(
        /([a-z])([A-Z])/g,
        "$1 $2"
      )
    : "";
};

const getEthnicOtherOriginValue = () => {
  return !ethnicityOrigins.value[0]
    ? ""
    : ethnicityOrigins.value[0].HMDAEthnicityOriginTypeOtherDescription
    ? ethnicityOrigins.value[0].HMDAEthnicityOriginTypeOtherDescription.replace(
        /([a-z])([A-Z])/g,
        "$1 $2"
      )
    : "";
};

const getRaceItems = (arr) => {
  const Races = races.value
    .filter((item) => item && item.HMDARaceType)
    .map((item) => item.HMDARaceType);
  const filtered = arr.length ? arr.filter((item) => Races.indexOf(item) === -1) : [];
  return filtered.length
    ? filtered.map((item) => item.replace(/([a-z])([A-Z])/g, "$1 $2"))
    : [];
};

const getOtherRaceValue = (race) => {
  if (!race.ULADHMDARaceDesignationType) return "";
  if (race.ULADHMDARaceDesignationType === "OtherAsian") {
    return race.ULADHMDARaceDesignationOtherAsianDescription || "";
  }
  return race.ULADHMDARaceDesignationOtherPacificIslanderDescription || "";
};

const addRace = () => {
  additional.value = { HMDARaceType: "" };
};

const removeRace = (index) => {
  const Races = races.value.filter((item, i) => i !== index);
  let Demographics = { ...demographics.value, Races };
  additional.value = null;
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
};

const demographics = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Demographics
    ? borrowersStore.Borrower.Demographics
    : {};
});

const ethnicities = computed(() => {
  return demographics.value.Ethnicities || [];
});

const ethnicityOrigins = computed(() => {
  return demographics.value.EthnicitiyOrigins || [];
});

const races = computed(() => {
  return demographics.value.Races || [];
});

const isOrigin = computed(() => {
  if (demographics.value.HMDAEthnicityRefusalIndicator) {
    return false;
  }
  return (
    ethnicities.value[0] &&
    ethnicities.value[0].ULADHMDAEthnicityType !== "NotHispanicOrLatino"
  );
});

const isOtherOrigin = computed(() => {
  return (
    ethnicityOrigins.value[0] &&
    ethnicityOrigins.value[0].HMDAEthnicityOriginType === "Other"
  );
});

const raceOriginsNames = computed(() => {
  return Object.keys(raceOptions.value);
});
</script>
<template>
  <v-card
    :style="{ backgroundColor: 'transparent' }"
    class="text-block text-black--text"
    :class="{ 'opacity-06': isDisabled }"
    light
    flat
    width="100%"
  >
    <v-card-text>
      <v-row class="text-block__row">
        <ComboBox
          :value="getEthnicity()"
          :items="ethnicityOptions"
          placeholder="Ethnicity"
          @change="setEthnicity"
          :disabled="isDisabled"
          :hideDetails="true"
          :smVal="6"
          :mdVal="6"
          :lgVal="4"
        />
        <template v-if="isOrigin">
          <ComboBox
            :value="getEthnicOriginTypeValue()"
            :items="ethnicGroups"
            placeholder="Sub Ethnic Group"
            @change="setEthnicityOrigin"
            :disabled="isDisabled"
            :smVal="6"
            :mdVal="6"
            :lgVal="4"
          />
            <TextBox
              v-if="isOtherOrigin"
              placeholder="Enter Origin"
              :value="getEthnicOtherOriginValue()"
              @input="(e) => setEthnicityOtherOrigin(e.target.value)"
              :disabled="isDisabled"
              :smVal="6"
              :mdVal="6"
              :lgVal="4"
            />
        </template>
      </v-row>
      <v-row>
        <ComboBox
          :value="
            demographics.ULADHMDAGenderType || 'I do not wish to provide this information'
          "
          :items="sexOptions"
          placeholder="Sex"
          @change="setSex"
          :disabled="isDisabled"
          :smVal="6"
          :mdVal="6"
          :lgVal="4"
        />
      </v-row>
      <v-row class="text-block__row mt-6 mb-4 ml-0 mb-sm-2">
        <v-col class="text-block__col">
          <v-row align="start" align-sm="center">
            <CheckBox
              :isChecked="demographics.HMDARaceRefusalIndicator"
              @toggle="(val) => setRaceRefusal(val)"
              :hideDetails="true"
              label="I do not wish to provide the information about Race"
              class="checkbox"
            />
          </v-row>
        </v-col>
      </v-row>
      <template v-if="!demographics.HMDARaceRefusalIndicator">
        <div v-if="races.length" class="mt-4">
          <v-row
            v-for="(race, index) in races"
            :key="index"
            class="text-block__row relative"
          >
            <ComboBox
              :value="
                race.HMDARaceType
                  ? race.HMDARaceType.replace(/([a-z])([A-Z])/g, '$1 $2')
                  : ''
              "
              :items="getRaceItems(raceOriginsNames)"
              placeholder="Race"
              @change="(item) => setRaceType(item, index)"
              :disabled="isDisabled"
              :smVal="6"
              :mdVal="6"
              :lgVal="4"
            />
            <template v-if="raceOptions[race.HMDARaceType]">
              <ComboBox
                :value="
                  race.ULADHMDARaceDesignationType
                    ? race.ULADHMDARaceDesignationType.replace(/([a-z])([A-Z])/g, '$1 $2')
                    : ''
                "
                :items="getRaceItems(raceOptions[race.HMDARaceType])"
                placeholder="Race Origin"
                @change="(item) => setRaceOrigin(item, index)"
                :disabled="isDisabled"
                :smVal="6"
                :mdVal="6"
                :lgVal="4"
              />
                <TextBox
                  v-if="
                    race.ULADHMDARaceDesignationType &&
                    race.ULADHMDARaceDesignationType.substring(0, 5) === 'Other'
                  "
                  placeholder="Enter Race"
                  :value="getOtherRaceValue(race)"
                  @input="(e) => setOtherRaceOrigin(e.target.value, index)"
                  :disabled="isDisabled"
                  :smVal="6"
                  :mdVal="6"
                  :lgVal="4"
                />
            </template>
            <v-col class="text-block__col text-end absolute">
              <v-icon class="remove__icon" @click="removeRace(index)">mdi-close</v-icon>
            </v-col>
          </v-row>
        </div>

        <v-row v-if="!races.length || additional" class="text-block__row relative">
          <ComboBox
            value=""
            :items="getRaceItems(raceOriginsNames)"
            placeholder="Race"
            @change="(item) => setRaceType(item, races.length)"
            :disabled="isDisabled"
            :hideDetails="false"
            :smVal="4"
          />
          <v-col class="text-block__col close-btn">
            <v-icon class="remove__icon" v-if="races.length" @click="additional = null"
              >mdi-close</v-icon
            >
          </v-col>
        </v-row>

        <v-row class="text-block__row last-row">
          <v-col class="text-block__col">
            <v-row class="form-container addItemBtnContainer">
              <v-col class="itemContainer" cols="12" sm="8">
                <v-btn
                  class="addItemBtn"
                  dense="dense"
                  plain="plain"
                  elevation="0"
                  @click="addRace"
                >
                  <v-icon small="small">mdi-plus</v-icon
                  ><span class="addBtnText">Add Race</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.form-container.addItemBtnContainer {
  margin-top: -30px !important;
  .itemContainer {
    margin-top: 30px !important;
  }
}
:deep(.v-combobox .v-theme--light) {
  max-height: 40px !important;
  .v-field__input {
    padding: 8px 12px !important;
  }
}

.close-btn{
  position: absolute;
  right: 0;
  justify-content: end;
  display: flex;
}

:deep(.v-field__append-inner) {
  padding: 7px 0px !important;
}
.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}

:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
.text-end {
  text-align: end !important;
}

.v-card-text {
  font-size: 16px !important;
}

:deep(.checkbox .v-selection-control) {
  align-items: center;

  @media (max-width:$lg-mobile-width) {
    align-items:flex-start;
  }

  .v-label{
    font-size: 16px;
    margin-left: 8px;
  }
}

:deep(.remove__icon) {
  color: $close-icon-color !important;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
  right: 0;
  top: -10px;
}
:deep(.v-selection-control--density-default) {
    --v-selection-control-size: 30px !important;
}
</style>
