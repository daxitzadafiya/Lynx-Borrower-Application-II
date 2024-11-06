<script setup>
import { computed, onMounted, ref, watch, defineEmits } from "vue";
import { countries } from "@/models/countries";
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { countryHandling } from "@/mixins/countryHandling"
const props = defineProps({
  addressObj: {
    type: Object,
    required: false,
    default:{}
  },
  uniqueInputId: {
    type: String,
    required: false
  },
  showMailingAddressSelector: {
    type: Boolean,
    default: false
  },
  isMailing: {
    type: Boolean,
    required: false
  },
  showCountry: {
    type: Boolean,
    default: true
  },
  mainAddressInputText: {
    type: String,
    default: 'Address'
  },
  isAddressRequired: {
    type: Boolean,
    default: false
  },
  mdVal: {
    type: [Number, String]
  },
  lgVal: {
    type: [Number, String]
  },
  USOnly: {
    type: Boolean,
    default: false
  },
  isSummary: {
    type: Boolean,
    default: false,
  },
  cityAndStateOnly:{
    type: Boolean,
    default: false,
    required:false
  }
});

const countriesNames = ref([]);
const isGoogleAddressFound = ref(true);
const borrowersStore = useBorrowersStore();
const emit = defineEmits(["addressPropUpdated", "addressUpdated", "mailingUpdated"]);
const { getCountryName, getCountryCode} = countryHandling()
const options = ref([
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]);

const address = computed(() => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (props.addressObj) {
    if (!isGoogleAddressFound.value) {
      return props.addressObj.AddressLineText;
    }
    return keys.reduce((acc, cur) => {
      if (props.addressObj[cur]) {
        acc += `${props.addressObj[cur]}${cur === (props.cityAndStateOnly ? "StateCode" : "PostalCode") ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return formattedAddress;
});

const addressUnit = computed(() => {
  return props.addressObj?.AddressUnitIdentifier
    ? props.addressObj?.AddressUnitIdentifier
    : "";
});
const { inputId, formattedAddress, geoLocate } =
  typeof props.uniqueInputId === "string" && googleAutoComplete(props.uniqueInputId);

watch(
  () => borrowersStore.autoCompleteAddress,
  (newValue) => {
    handleAddressData(newValue.inputId,newValue.value);
  },
  { deep: true }
);


const handleAddressData = (inputId,addressData) => {
  if(props.uniqueInputId === inputId) {
    isGoogleAddressFound.value = !!addressData;
    if (addressData) {
      isGoogleAddressFound.value = props.cityAndStateOnly ? addressData.CityName != null &&  addressData.StateCode != null  && addressData.CountryCode != null:
        addressData.CityName != null &&
        addressData.CountryCode != null &&
        addressData.PostalCode != null &&
        addressData.StateCode != null &&
        addressData.AddressLineText != null;
    }
    let propertyData = props.cityAndStateOnly ? {CityName: addressData.CityName,StateCode: addressData.StateCode, CountryCode: addressData.CountryCode}:{
      CityName: addressData.CityName,
      CountryCode: addressData.CountryCode,
      PostalCode: addressData.PostalCode,
      StateCode: addressData.StateCode,
      AddressLineText: addressData.AddressLineText,
    };
    let property = props.addressObj
      ? { ...props.addressObj, ...propertyData }
      : propertyData;
     if(isGoogleAddressFound.value && props.cityAndStateOnly){
       property.AddressLineText = ''
     } 
    if (isGoogleAddressFound.value) {
      emit("addressUpdated", property);
    }
  }
};

onMounted(() => {
  if (address?.value?.length != 0 && address?.value?.length != undefined ) {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}&key=AIzaSyBsEdcuR5dCQVp4cL1cCAbPR6XlEEMpJEQ&language=en`
    )
      .then((stream) => stream.json())
      .then((data) => {
        if (data.results.length === 0) {
          isGoogleAddressFound.value = false;
        } else {
          isGoogleAddressFound.value = true;
        }
      });
  }
  countriesNames.value = getCountriesNames();
});

const findAddressData = (value) => {
  if (value.length === 0) {
    emit("addressUpdated", {
      AddressLineText: "",
      CityName: "",
      PostalCode: "",
      StateCode: "",
    });
    isGoogleAddressFound.value = false;
    return;
  }
  if (value && isGoogleAddressFound.value) {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyBsEdcuR5dCQVp4cL1cCAbPR6XlEEMpJEQ&language=en`
    )
      .then((stream) => stream.json())
      .then((data) => {
        if (data.results.length === 0) {
          formattedAddress.value = "";
        } else {
          isGoogleAddressFound.value = false;
        }
      })
      .catch((error) => console.error(error));
  } else if (!isGoogleAddressFound.value) {
    // Remove maybe
    emit("addressPropUpdated", {
      value: value,
      prop: "AddressLineText",
    });
  }
};

const getCountriesNames = () => {
  return countries.map((country) => country.longName);
};

defineExpose({
  isGoogleAddressFound,
});
</script>
<template>
  <div style="display: contents">
      <TextBox
        :mdVal="mdVal"
        :lgVal="lgVal"
        :placeholder="mainAddressInputText"
        :class="[
          'AddressLineTextInput',
          {
            'v-col-sm-8': isGoogleAddressFound,
          },
        ]"
        :id="inputId"
        @focus="geoLocate"
        :value="address"
        @onChange="(val) => findAddressData(val)"
        :isRequired="isAddressRequired"
      />
      <TextBox
        v-if="!isGoogleAddressFound && !cityAndStateOnly"
        :value="addressUnit"
        :mdVal="mdVal"
        :lgVal="lgVal"
        placeholder="Unit #"
        @input="
        e =>
          emit('addressPropUpdated', {
            value: e.target.value,
            prop: 'AddressUnitIdentifier'
          })
      "
      />
      <TextBox
        v-if="!isGoogleAddressFound && !cityAndStateOnly"
        :value="addressObj?.CityName"
        :mdVal="mdVal"
        :lgVal="lgVal"
        placeholder="City"
        :isRequired="isAddressRequired ? true : cityAndStateOnly ? true : false"
        @input="e => emit('addressPropUpdated', { value: e.target.value, prop: 'CityName' })"
      />
      <TextBox
        v-if="!isGoogleAddressFound && !cityAndStateOnly"
        :value="addressObj?.StateCode"
        :mdVal="mdVal"
        :lgVal="lgVal"
        placeholder="State"
        :isRequired="isAddressRequired ? true : cityAndStateOnly ? true : false"
        @input="e => emit('addressPropUpdated', { value: e.target.value, prop: 'StateCode' })"
      />
      <TextBox
        v-if="!isGoogleAddressFound && !cityAndStateOnly"
        :value="addressObj?.PostalCode"
        :mdVal="mdVal"
        :lgVal="lgVal"
        placeholder="Zip Code"
        :isRequired="isAddressRequired ? true : false"
        @input="
        e => emit('addressPropUpdated', { value: e.target.value, prop: 'PostalCode' })
      "
      />
      <SelectBox
        v-if="!isGoogleAddressFound && showCountry && !cityAndStateOnly"
        :value="USOnly ? getCountryName('US') :addressObj?.CountryCode ? getCountryName(addressObj?.CountryCode) : ''"
        :mdVal="mdVal"
        :lgVal="lgVal"
        placeholder="Country"
        :items="USOnly ? ['United States'] : countriesNames"
        @change="e => emit('addressPropUpdated', {value: getCountryCode(e), prop: 'CountryCode'})"
        :disabled="USOnly"
      />

      <v-col
        class="itemContainer d-flex flex-column h-100"
        md="6"
        lg="6"
        v-if="showMailingAddressSelector"
      >
          <div class="titleText mt-2">Mailing Address :</div>
          <Radio :value="isMailing" :options="options" @change="(e) => emit('mailingUpdated', e)"></Radio>
      </v-col>
      <slot></slot>
  </div>
</template>
