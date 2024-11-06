<script setup>
// import logo from '@/assets/images/logo.png';
import { useRoute } from "vue-router";
import { computed, watch } from "vue";
import { defineProps, defineEmits, ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useGeneralStore } from "@/stores/generalStore";
import { number } from "@/mixins/onlyNum";
import ModelsAndFormsMenu from "./ModelsAndFormsMenu.vue";
import AccountMenu from "./AccountMenu.vue";
import { onMounted } from "vue";
const props = defineProps({
    address: {
        type: String,
        default: ""
    },
    items: {
        type: Array,
        default: () => []
    },
    accountItems: {
        type: Array,
        default: () => []
    }
});
const { isOnlyNum } = number();
const { getLoanById, toggleTestingNav } = useGeneralStore()
const route = useRoute();
const emit = defineEmits(['makeAction']);
const isBorrowersPage = computed(() => {
    return route.name === "borrowers"
})
const isScrolled = ref(false);

const userTypeCheck = computed(() => {
    const { currentUser } = useUserStore()
    return currentUser.userTypeId !== 7 && currentUser.userTypeId !== 8
});
const loanId = ref("");
const isSearch = ref(false);

const toggleSearch = async () => {
    if (isSearch.value && loanId.value) {
        return await getLoanById(loanId.value);
    }
    isSearch.value = true;
}
const logo = ref('');
onMounted(async () => {
    logo.value = await import(`../../assets/images/${import.meta.env.VITE_BRAND}/logo.png`);
})
</script>
<template>
  <v-app-bar id="desktop-header" height="88px" dark flat app class="lynx-primary">
    <v-container
      fill-height
      style="
        height: 88px;
        display: flex;
        color: white;
        max-width: 1441px;
        padding: 0 10px;
        align-items: center;
      "
    >
      <v-col cols="2" class="logo-col">
        <img
          class="main-logo"
          :src="logo.default"
          style="width: auto; height: auto; max-height: 60px; max-width: 175px"
          @click="toggleTestingNav"
        />
      </v-col>
      <v-col cols="8" class="list">
        <v-row
          v-if="!isBorrowersPage"
          align="center"
          justify="center"
          class="scrolled-row"
        >
          <v-col
            :style="{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              minWidth: address ? '265px' : '150px',
            }"
            :class="{ col_translated: isScrolled }"
            class="scrolled-col address-col"
          >
            <div class="item__address">
              <p class="item__data item_relative">
                <v-icon
                  class="item__address-icon header-label-text progress"
                  aria-hidden="false"
                  v-if="address"
                >
                  mdi-home
                </v-icon>
                <span class="item__address-text" v-html="address"></span>
              </p>
            </div>
          </v-col>
          <v-col
            v-for="(item, index) in props.items"
            :key="index"
            :class="{ col_translated: isScrolled }"
            class="toolbar-item scrolled-col"
          >
            <div v-if="item.data">
              <span class="header-label-text" style="font-size: 11px">{{
                item.label
              }}</span>
              <v-icon v-if="item.isIcon" class="item__icon progress" aria-hidden="false">
                mdi-help-circle
              </v-icon>
              <p class="item__data">
                <span v-if="item.isCurrency">
                  {{
                    item.data.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}
                </span>
                <span v-else-if="item.isPercent">
                  {{
                    (item.data / item.multiple).toLocaleString("en-US", {
                      style: "percent",
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })
                  }}
                </span>
                <span v-else>{{ item.data }}</span>
              </p>
            </div>
          </v-col>
          <div class="arrow lynx-primary">
           <div class="right-arrow">              
              <v-icon
              @click="isScrolled = !isScrolled"
              @blur="isScrolled = false"
              tabindex="1"
              :class="{ reversed: isScrolled }"
            >
              mdi-chevron-right
            </v-icon>
            </div> 
          </div>
        </v-row>
      </v-col>
      <v-col cols="2" align="center" class="menu-wrapper">
        <v-row align="center" justify="end" class="account-block">
          <v-text-field
            v-if="userTypeCheck"
            v-model="loanId"
            @focus="isSearch = true"
            dense
            color="white"
            @keypress="(e) => isOnlyNum(e)"
            @keypress.enter="toggleSearch"
            class="search-field"
          ></v-text-field>
          <div class="search d-flex align-center">
            <div class="search__icon bordered">
              <v-btn icon @click="toggleSearch" width="35" height="35">
                <v-icon size="20">mdi-magnify</v-icon>
              </v-btn>
            </div>
            <ModelsAndFormsMenu></ModelsAndFormsMenu>
          </div>
          <AccountMenu
            :accountItems="accountItems"
            @makeAction="({ title }) => emit('makeAction', { title })"
          ></AccountMenu> </v-row
      ></v-col>
    </v-container>
  </v-app-bar>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/desktop-header.scss";
@import "@/assets/styles/headers.scss";

.item {
  &__address {
    min-height: 60px;
  }
  &__address-icon {
    position: absolute;
    top: 3px;
    left: -24px;
    font-size: 24px !important;
  }
  &__address-text {
    display: inline-block;
    padding-top: 2px;
    padding-left: 4px;
    line-height: 1.5;
    color: $header-text-color;
  }
  &_relative {
    position: relative;
    min-height: 42px;
  }
}

#desktop-header {
    z-index: 11;
    background-color: $primary !important;
}
.search{
  @media (max-width: $tablet-width) {
    margin-right: 5px;
  }
}
:deep(.account-block){
    margin-right: -17px !important;
}
:deep(.v-toolbar__content) {
  padding: 4px 16px !important;
  height: 88px !important;
}
.lynx-primary {
    right: 5px;
    top: 43%;
    transform: translateY(-50%);
    width: 32px;
    height: 38px;
  .right-arrow {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        width: 6px;
    }
  }
}

@media (max-width: $xl-desktop-width) and (min-width: 1099px){
  .menu-wrapper{
    height: 79px;
    .account-block{
    height: 79px;
  
    .search{
      margin: 0 5px 0 0;
    }
  
    .account{
      height: 31px;
    }
    }
  }
}
</style>