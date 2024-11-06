<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import CustomButton from "../core-components/CustomButton.vue";
import config from "@/configs";

const SqFtIcon = ref(null);
let sqFtLotIcon = await import("@/assets/images/sq-ft-rulers.svg");
SqFtIcon.value = sqFtLotIcon.default;

const SqFtLotIcon = ref(null);
let sqFtLot = await import("@/assets/images/sq-ft-lot.svg");
SqFtLotIcon.value = sqFtLot.default;

const TaxAmountIcon = ref(null);
let taxAmount = await import("@/assets/images/receipt-tax.svg");
TaxAmountIcon.value = taxAmount.default;
const selectedType = ref(null);
const types = ref([
  "Single Family Detached",
  "Condominium",
  "Townhouse",
  "Co-operative",
  "Two-to-four Unit Property",
  "Multifamily",
  "Manufactured/Mobile",
]);
const years = ref([]);
const coord = ref(null);
const mapTypeControlOptions = ref(null);
const infoBoxVisible = ref(false);
const legalDescription = ref(false);
const loanPropertyStore = useLoanPropertyStore();
const realEstateStore = useRealEstateStore();
const lenderInfoStore = useLenderInfoStore();
const addressKeys = ref(["AddressLineText", "CityName", "StateCode", "PostalCode"]);
const Property = ref(loanPropertyStore.getProperty());

const setDate = (year) => {
  const property = Property.value
    ? { ...Property.value, YearBuilt: year }
    : { YearBuilt: year };
  loanPropertyStore.setProperty(property);
};

const setPropertyType = (type) => {
  if (type !== "Condominium" && type !== "Townhouse" && type !== "Co-operative") {
    let HousingExpenses = [...realEstateStore.getHousingExpenses()];
    const expenseIndex = HousingExpenses.findIndex(
      (item) => item.HousingExpenseType === "ContentsInsurance"
    );
    if (HousingExpenses !== -1) {
      HousingExpenses.splice(expenseIndex, 1);
      lenderInfoStore.updateMortgageLoanInfo({
        prop: "HousingExpenses",
        value: HousingExpenses,
      });
    }
  }

  const property = Property.value
    ? { ...Property.value, PropertyType: type ? type.replace(/ /g, "") : "" }
    : { PropertyType: type ? type.replace(/ /g, "") : "" };

  loanPropertyStore.setProperty(property);
};

const address = computed(() => {
  if (Property.value) {
    return addressKeys.value.reduce((acc, cur) => {
      if (Property.value[cur]) {
        acc += `${Property.value[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return "";
});

const setMapOptions = () => {
  if (address.value != null && address.value !== "") {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: address.value,
      },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          coord.value = {
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng(),
          };
          return;
        }
      }.bind(this)
    );
  } else {
    coord.value = null;
  }
};

const showInfo = () => {
  infoBoxVisible.value = true;
};

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
    setMapOptions();
  },
  { deep: true }
);

onMounted(() => {
  if (google) {
    mapTypeControlOptions.value = {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
    };
  }
  const currentYear = new Date().getFullYear() + 1;
  years.value = Array.from({ length: currentYear - 1799 }, (_, index) =>
  (currentYear - index).toString()
  );

  setMapOptions();
});

const mapZoomLevel = computed(() => {
  return config.mapZoomLevel;
});

const titleEnd = computed(() => {
  return loanPropertyStore.getLoanPurposeType() || "Purchase";
});

const yearBuilt = computed(() => {
  return Property.value != null ? Property.value.YearBuilt : null;
});

const isNextDisabled = computed(() => {
  return (
    Property.value == null ||
    Property.value.PropertyType == null ||
    Property.value.PropertyType == "" ||
    yearBuilt.value == null
  );
});

const fullViewHref = computed(() => {
  if (coord.value != null) {
    const addressParts = ["AddressLineText", "CityName"];
    let hrefForGoogleMaps = addressParts
      .map((part) => {
        if (Property.value[part]) {
          const words = Property.value[part]
            .split(/(?=[A-Z])/)
            .map((word) => word.trim());
          return words.join("+");
        }
        return "";
      })
      .filter((part) => part !== "")
      .join("+");
    const otherKeys = addressKeys.value.filter((key) => !addressParts.includes(key));
    const otherValues = otherKeys
      .map((key) => Property.value[key])
      .filter((value) => value !== "")
      .join("+");
    hrefForGoogleMaps += otherValues !== "" ? "+" + otherValues : "";
    return `https://maps.google.com/maps?q=${hrefForGoogleMaps}&z=17&t=h&hl=en&gl=US&mapclient=apiv3`;
  }
  return null;
});

const PropertyPrice = computed(() => {
  return Property.value && Property.value.PropertyValuationAmount
    ? "$" + getFormattedValue(Property.value.PropertyValuationAmount)
    : "";
});

const RoomsAmount = computed(() => {
  return Property.value &&
    Property.value.PropertyDetail &&
    Property.value.PropertyDetail.Rooms
    ? Property.value.PropertyDetail.Bedrooms
    : "";
});

const BathroomsAmount = computed(() => {
  return Property.value &&
    Property.value.PropertyDetail &&
    Property.value.PropertyDetail.Bathrooms
    ? Property.value.PropertyDetail.Bathrooms
    : "";
});

const SqFt = computed(() => {
  return Property.value &&
    Property.value.PropertyDetail &&
    Property.value.PropertyDetail.HouseSquareFeet
    ? getFormattedValue(Property.value.PropertyDetail.HouseSquareFeet)
    : "";
});
const SqFtLot = computed(() => {
  return Property.value &&
    Property.value.PropertyDetail &&
    Property.value.PropertyDetail.LotSquareFeet
    ? getFormattedValue(Property.value.PropertyDetail.LotSquareFeet)
    : "";
});
const TaxYear = computed(() => {
  return Property.value &&
    Property.value.PropertyDetail &&
    Property.value.PropertyDetail.TaxYear
    ? Property.value.PropertyDetail.TaxYear
    : "";
});
const TaxAmount = computed(() => {
  return Property.value &&
    Property.value.PropertyDetail &&
    Property.value.PropertyDetail.Taxes
    ? "$" + getFormattedValue(Property.value.PropertyDetail.Taxes)
    : "";
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Property details for {{ address }}</div>
    </div>
    <div class="inner-content-container">
      <div class="desktop-content-wrapper pr-3">
        <div class="property-details__wrapper">
          <v-row class="form-container ml-0">
            <v-col class="box--right text-block__col no-padding-col py-0 px-0" cols="12">
              <div class="details-grid">
                <v-col class="details-card">
                  <v-icon class="icon-color-main">mdi-home</v-icon>
                  <div class="details-card-info">
                    <span> Property Price </span>
                    {{ PropertyPrice }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <v-icon class="icon-color-main">mdi-bed-king</v-icon>
                  <div class="details-card-info">
                    <span>Rooms</span>
                    {{ RoomsAmount }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <v-icon class="icon-color-main">mdi-bathtub</v-icon>
                  <div class="details-card-info">
                    <span> Bathrooms </span>
                    {{ BathroomsAmount }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <inline-svg :src="SqFtIcon" class="icon-color-main" />
                  <div class="details-card-info">
                    <span class="text-block__row-subtitle"> Sq.ft </span>
                    {{ SqFt }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <inline-svg :src="SqFtLotIcon" class="icon-color-main" />
                  <div class="details-card-info">
                    <span> Sq.ft lot </span>
                    {{ SqFtLot }}
                  </div>
                </v-col>
                <v-col class="details-card">
                  <inline-svg :src="TaxAmountIcon" class="icon-color-main" />
                  <div class="details-card-info">
                    <span> Taxes {{ TaxYear }} </span>
                    {{ TaxAmount }}
                  </div>
                </v-col>
              </div>
              <div :class="['legal-description', { active: legalDescription }]">
                <div class="legal-description-title">Legal Description</div>
                <div
                  class="legal-description-content"
                  @click="legalDescription = !legalDescription"
                  v-if="
                    Property?.PropertyDetail && Property?.PropertyDetail.LegalDescription
                  "
                >
                  <p>{{ Property.PropertyDetail.LegalDescription }}</p>
                  <v-icon small>
                    {{ legalDescription ? "mdi-minus" : "mdi-plus" }}
                  </v-icon>
                </div>
              </div>
            </v-col>
            <v-col
              class="mobile-map-wrapper mb-5 pl-0 pt-0"
              cols="12"
              style="position: relative"
            >
              <GoogleMap
                style="height: 100%; width: 100%"
                v-if="coord != null"
                :center="{ lat: +coord.latitude, lng: +coord.longitude }"
                :zoom="mapZoomLevel"
                :streetViewControl="false"
                :mapTypeId="'hybrid'"
                :mapTypeControl="true"
                :scaleControl="false"
                :rotateControl="false"
                :fullscreenControl="false"
                :disableDefaultUi="false"
                :mapTypeControlOptions="mapTypeControlOptions"
              >
                <Marker
                  :options="{ position: { lat: +coord.latitude, lng: +coord.longitude } }"
                ></Marker>
              </GoogleMap>
              <v-btn :href="fullViewHref" target="_blank" class="popout-button">
                <v-icon size="28">mdi-fullscreen</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <h3
          class="py-4 selectPropertyDetailHeader content-header-container mb-5 font-weight-bold"
          xs="12"
          sm="8"
          cols="12"
        >
          Please select the Property Type and Year Built
        </h3>
        <v-row class="form-container text-block__row mr-0 mr-md-2">
          <ComboBox
            placeholder="Property Type"
            :items="types"
            :value="
              Property && Property.PropertyType
                ? Property.PropertyType.replace(/([a-z])([A-Z])/g, '$1 $2')
                : ''
            "
            @change="(type) => setPropertyType(type)"
          />
          <SelectBox
            :items="years"
            :value="yearBuilt"
            placeholder="Year Built"
            @change="(value) => setDate(value)"
          />
        </v-row>
      </div>
      <div class="desktop-map-wrapper pl-3" style="position: relative">
        <GoogleMap
          style="height: 100%; width: 100%"
          v-if="coord != null"
          :center="{ lat: +coord.latitude, lng: +coord.longitude }"
          :zoom="mapZoomLevel"
          :streetViewControl="false"
          :mapTypeId="'hybrid'"
          :mapTypeControl="true"
          :scaleControl="false"
          :rotateControl="false"
          :fullscreenControl="false"
          :disableDefaultUi="false"
          :mapTypeControlOptions="mapTypeControlOptions"
        >
          <Marker
            :options="{ position: { lat: +coord.latitude, lng: +coord.longitude } }"
          ></Marker>
        </GoogleMap>
        <v-btn :href="fullViewHref" target="_blank" class="popout-button">
          <v-icon size="28">mdi-fullscreen</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
    <v-dialog v-model="infoBoxVisible" max-width="550">
      <v-card>
        <v-card-title>Info</v-card-title>
        <v-card-text class="d-flex justify-center mb-4 body-2">
          <ul style="list-style: disc">
            <li>
              An HO-6 policy will cover your unit’s interior, improvements you’ve made to
              the building, any additions or alterations, and all your personal property.
            </li>
            <li class="mt-2">
              The condo association master policy is there to protect the building and its
              inhabitants. This includes general liability for the association and
              property damage coverage for common areas.
            </li>
            <li class="mt-2">
              The condo insurance cost nationwide is $625 on average with a $1,000
              deductible, $300,000 in liability, and $60,000 in personal property
              coverage.
            </li>
          </ul>
        </v-card-text>
        <v-card-text>
          <v-row class="justify-space-around">
            <CustomButton
              value="Close"
              customClass="button-yes"
              width="120px"
              isOutlined="isOutlined"
              @onHandleClick="() => (infoBoxVisible = false)"
            ></CustomButton>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.box {
  &--left {
    width: 70%;
  }
}
.text-block {
  margin: 0;
  padding-right: 45px;
  &__icon {
    margin-right: 5px;
  }
}
.my-block {
  margin-bottom: 10px;
}

.w-100 {
  width: 100%;
}

.icon-box {
  flex-wrap: nowrap;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  padding: 5px 10px;
  margin-bottom: 10px;
}

.property-details__wrapper {
  display: flex;
  @media (max-width: $tablet-width) {
    flex-direction: column-reverse;
  }
}
.no-wrap {
  flex-wrap: nowrap;
  @media (max-width: 1110px) {
    flex-wrap: wrap;
  }
}
.last-row {
  padding-left: 10px;
  margin-bottom: 20px;
}

.any-row {
  margin-bottom: 10px;
}

.underlined {
  text-decoration: underline;
}

@media (min-width: $tablet-width) {
  .main {
    &__subtitle {
      padding-left: 0;
    }
  }
}

@media (max-width: $tablet-width) {
  .pl-10-768 {
    padding-left: 10px;
  }
}

@media (max-width: $sm-tablet-width) {
  .text-block {
    padding: 0 12px;
  }
  .card-header {
    margin: 0 -12px;
  }
  .pl-10-768 {
    padding-left: 0;
  }
  .last-row {
    padding-left: 0;
  }
}

.desktop-content-wrapper {
  max-width: 100%;
}
.desktop-map-wrapper {
  width: 360px;
  height: 340px;
  flex-shrink: 0;
  display: block;
  @media (max-width: $max-page-width) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: $tablet-width) {
    display: none;
  }
}

.mobile-map-wrapper {
  display: none;
  @media screen and (max-width: $tablet-width) {
    max-height: 260px;
    display: block;
    width: 250px;
    padding: 0;
    padding-left: 20px !important;
  }
  @media screen and (max-width: $tablet-width) {
    width: 100%;
    min-height: 260px;
    padding-left: 0 !important;
  }
}

.selectPropertyDetailHeader {
  margin-left: -$content-padding-x;
  width: calc(100% + 30px);
  padding-left: $content-padding-x;
  background-color: $content-headr-bg;
  font-size: 16px;
  @media (max-width: $max-page-width) {
    margin-right: 0;
    padding-left: $content-padding-tablet-x;
    padding-right: $content-padding-tablet-x;
    width: calc(100% + 35px);
  }
  @media (max-width: $tablet-width) {
    margin-left: -$content-padding-tablet-x;
    padding-left: $content-padding-tablet-x;
    width: calc(100% + 40px);
  }
  @media (max-width: $lg-mobile-width) {
    width: calc(100% + 20px);
  }
}

.popout-button {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 10px !important;
  width: 37px !important;
  min-width: 1px !important;
}

.details-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 25px;
  @media (max-width: $max-page-width) {
    max-width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: $tablet-width) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.details-card {
  box-shadow: 0px 1px 8px 0px #00000026;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  & > img {
    width: 25px;
    height: 25px;
  }
  &-info {
    font-size: 14px;
    color: $content-black;
    font-weight: 500;
    span {
      font-size: 12px;
      color: #828282;
      display: block;
    }
  }
}

.legal-description {
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 20px;
  &:not(.active) {
    p {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  &-title {
    text-decoration: underline;
    margin-bottom: 8px;
  }
  &-content {
    display: flex;
    cursor: pointer;
    p {
      flex-grow: 1;
      margin-bottom: 0;
    }
    .v-icon {
      color: $content-black;
      height: 16px;
      flex-shrink: 0;
    }
  }
}

.inner-content-container {
  display: flex;
}

.desktop-content-wrapper {
  width: calc(100% - 360px);
  @media (max-width: $max-page-width) {
    flex-grow: 1;
  }
  @media screen and (max-width: $tablet-width) {
    padding-right: 0 !important;
    width: 100%;
    max-width: none;
  }
  .form-container {
    max-width: 100%;
    margin: 0 !important;
  }
}

:deep(.icon-color-main) {
  path {
    &[fill] {
      fill: $primary !important;
    }
    &[stroke] {
      stroke: $primary !important;
    }
  }
}
.popout-button {
  padding: 0 !important;
  height: 37px;
  i {
    color: rgb(102, 102, 102);
    font-size: 28px !important;
    height: auto !important;
    width: auto !important;
  }
}
.legal-description-content .v-icon {
  font-size: 16px;
}
:deep(.v-select__selection-text){
  line-height: 21px;
}
</style>
