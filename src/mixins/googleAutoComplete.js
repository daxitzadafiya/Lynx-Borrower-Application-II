import { onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import { useBorrowersStore } from '@/stores/borrowersStore'
export function googleAutoComplete(uniqueInputId){
  
  const inputId = ref(uniqueInputId || "autocomplete");

  const borrowersStore = useBorrowersStore()
  const autocomplete = ref("")
  const componentForm = ref({
    street_number: "short_name",
    route: "long_name",
    locality: "long_name",
    administrative_area_level_1: "short_name",  
    country: "short_name",
    postal_code: "short_name"
  })
  const addressFields = ref({
    route: "AddressLineText",
    locality: "CityName",
    administrative_area_level_1: "StateCode",
    country: "CountryCode",
    postal_code: "PostalCode"
  })
  const formattedAddress = ref("")

  const initAutocomplete = () => {
    // autocomplete.value = new google.maps.places.Autocomplete(
    //   document.getElementById(inputId.value),
    //   { types: ["geocode"] }
    //   );
    // autocomplete.value.setFields(["address_component", "formatted_address"]);
    // autocomplete.value.setComponentRestrictions({ country: ["us"] });
    // autocomplete.value.addListener("place_changed", fillInAddress);
    nextTick(async () => {
      if(inputId.value){
        const inputElement = document.getElementById(inputId.value);
        if (inputElement instanceof HTMLInputElement) {
          autocomplete.value = new google.maps.places.Autocomplete(inputElement, { types: ["geocode"] });
          autocomplete.value.setFields(["address_component", "formatted_address"]);
          autocomplete.value.setComponentRestrictions({ country: ["us"] });
          autocomplete.value.addListener("place_changed", fillInAddress);
        }
      }
    });
  }

  const fillInAddress = () => {
    try {
      const place = autocomplete.value.getPlace();
      borrowersStore.setAutoCompleteAddress(inputId.value,parseAddressData(place));
      return parseAddressData(place);
    }catch(error) {
      console.log(error)
    }
    
  }

  const parseAddressData = (place) => {
    if (place && place.formatted_address) {
      formattedAddress.value = place.formatted_address;
    }
    if (place && place.address_components) {
      let addressData = {};
      let streetNumber = "";
      for (let i = 0; i < place.address_components.length; i++) {
        let addressType = place.address_components[i].types[0];
        if (addressType === "street_number") {
          streetNumber = place.address_components[i]["short_name"] || "";
        } else if (componentForm.value[addressType]) {
          const val =
            place.address_components[i][componentForm.value[addressType]];
          addressData[addressFields.value[addressType]] = val || "";
          if (addressType === "route") {
            addressData[addressFields.value.route] = `${streetNumber} ${
              addressData[addressFields.value.route]
            }`;
          }
        }
      }
      return addressData;
    }
   return place
  }

  const geoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.value.setBounds(circle.getBounds());
      });
    }
  }

  onMounted(() => initAutocomplete())

  // created(() => {
  //   if (uniqueInputId) {
  //     inputId.value = uniqueInputId;
  //   }
  // })

  onBeforeUnmount(() => {
    autocomplete.value = "";
  });


  return {inputId, autocomplete, componentForm, addressFields, formattedAddress, initAutocomplete, parseAddressData, fillInAddress, geoLocate}
}
