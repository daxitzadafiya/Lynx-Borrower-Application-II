<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBrandingStore } from '@/stores/brandingStore';
import PlantsWithHouse from "@/components/images/sidebar/PlantsWithHouse.vue";

const brandingStore = useBrandingStore();
const isHostedMode = computed(() => brandingStore.getIsHostedMode);
const drawer = ref(true);
const currentActive = ref(0);
const isExpanded = ref(false);
const list = ref([]);


onMounted(async () => {
  setTimeout(() => {
    currentActive.value = 1;
  }, 1500);
  const imageImports = [
    {
      text: "Borrowers",
      rootPath: "borrowers",
      icon: import('@/assets/images/sidebar/borrowers.svg'),
    },
    {
      text: "Loan & Property",
      icon: import('@/assets/images/sidebar/loan-property.svg'),
    },
    {
      text: "Credit & Liabilities",
      icon: import('@/assets/images/sidebar/credit-liabilities.svg'),
    },
    {
      text: "Accounts & Assets",
      icon: import('@/assets/images/sidebar/accounts-assets.svg'),
    },
    {
      text: "Employment & Income",
      icon: import('@/assets/images/sidebar/employment-income.svg'),
    },
    {
      text: "Declarations",
      isLast: false,
      icon: import('@/assets/images/sidebar/declarations.svg'),
    },
    {
      text: "Rates & Offers",
      isLast: false,
      icon: import('@/assets/images/sidebar/rates-offers.svg'),
    },
  ];

  const images = await Promise.all(imageImports.map(image => image.icon));

  list.value = imageImports.map((image, index) => ({
    ...image,
    icon: images[index].default,
  }));
});

watch(currentActive, (val) => {
  setTimeout(() => {
    if (val == list.value.length) currentActive.value = 0;
    else currentActive.value = val + 1;
  }, 1500);
});


const toggleNavInHostedMode = () => {
  if (isHostedMode.value) {
    toggleTestingNav();
  }
};

const windowClicked = (e) => {
  if (!e.target.closest(".sidebar")) {
    toggleSidebarExpand();
  }
};

const toggleSidebarExpand = () => {
  
  if (!isExpanded.value) {
    window.addEventListener("click", windowClicked);
  } else {
    window.removeEventListener("click", windowClicked);
  }
  isExpanded.value = !isExpanded.value;
};

</script>
<template>
  <div class="sidebar" :class="{ sidebar_hosted: isHostedMode }">
    <v-navigation-drawer :class="{ isExpanded: isExpanded, navDrawer: true }" v-model="drawer" height="100%">
      <v-list class="listItems">
        <v-list-item v-for="(item, index) in list" :key="index" class="sidebar-list" style="padding: 0; z-index: 1">
          <!-- <v-list-item-content > -->
          <div class="item-content">
            <div class="item align-center" style="padding-left: 1px">
              <span class="item__circle"
                :class="{ 'item_active item_long-line': index === currentActive && index === 0, 'item_no-line': item.isLast || index === list.length - 1, item_passed: currentActive > index, }">
                <div class="progress sidebar-icon-circle"
                  :class="{ 'sidebar-item-circle_active': currentActive == index, 'sidebar-item-circle_passed': currentActive > index, }">
                  <div class="tabletIcon"
                    :class="{ 'sidebar-item-circle_active': currentActive == index, 'sidebar-item-circle_passed': currentActive > index, }">
                    <span class="sidebar-progress-count" v-show="index === currentActive">{{ index + 1 }}</span>
                    <inline-svg v-if="index != currentActive" :src="item.icon"
                      :class="{ 'sidebar-list-item_active': currentActive == index, 'sidebar-list-item_passed': currentActive > index, }" />
                  </div>
                </div>
              </span>
              <div class="item__text">
                <v-list-item-title class="item__title mt-0  tracking-normal"
                  :class="{ 'active side-nav-selected-color': currentActive == index, 'sidebar-nav-passed-color ': currentActive > index, }">
                  <span>{{ item.text }}</span>
                </v-list-item-title>
              </div>
            </div>
          </div>
          <!-- </v-list-item-content> -->
        </v-list-item>
      </v-list>
      <div class="sidebarExpandBtn">
        <v-btn icon small @click="toggleSidebarExpand">
          <v-icon class="sidebarIcon mdi mdi-page-layout-sidebar-left"></v-icon>
        </v-btn>
      </div>
      <div class="sidebar__image">
        <PlantsWithHouse class="sidebar__bottom-image" />
      </div>
    </v-navigation-drawer>
  </div>

</template>

<style lang="scss" scoped>
@import "@/assets/styles/sidebarV2.scss";

.listItemIcon {
  width: auto;
  max-height: 20px;
  max-width: 20px;
  display: block;

  @media (max-width: $sidebar-tablet-breakpoint) {
    display: none;
  }
}

.tabletIcon {
  display: none;

  @media (max-width: $sidebar-tablet-breakpoint) {
    display: block;
  }
}

.desktopIcon {
  display: block;

  @media (max-width: $sidebar-tablet-breakpoint) {
    display: none;
  }
}

.navDrawer {
  min-width: 292px;
  max-width: unset;
  visibility: visible;

  @media (max-width: $sidebar-tablet-breakpoint) {
    width: fit-content !important;
  }
}

.navDrawer {
  @media (max-width: $sidebar-tablet-breakpoint) {
    min-width: 60px;
    max-width: 60px;
  }
  .listItems {
    flex-grow: 1;
    padding: 30px 0px 10px 16px;
    overflow-y: auto;
    @media (max-width: $sidebar-tablet-breakpoint) {
      padding: 20px 5px 10px 5px;
    }
  }

  @media (max-width: $sidebar-tablet-breakpoint) {
    .crossBtn {
      opacity: 0;
      pointer-events: none;
    }
    .hamBurgerBtn {
      opacity: 1;
      pointer-events: all;
    }
  }

  &.isExpanded {
    max-width: 292px;
    min-width: 292px;
    @media (max-width: $sidebar-tablet-breakpoint) {
      .hamBurgerBtn {
        opacity: 0;
        pointer-events: none;
      }
      .crossBtn {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
}

.hamBurgerBtn,
.crossBtn {
  margin: 17px;
  padding: 3px;

  svg {
    width: 22px;
  }
}

.sidebarExpandBtn {
  display: none;
  @media (max-width: $sidebar-tablet-breakpoint) {
    display: block;
  }
  padding: 5px 15px;
  z-index: 1000;
  .sidebarIcon {
    color: $primary;
  }
}

.sidebar {
  z-index: 99;
  height: calc(100vh - 88px);
  position: sticky;
  width: 100%;
  top: 88px;
  margin-top: 0;
  &-item-circle_active{
    opacity: 1;
    animation: fadeIn 1s linear forwards;
  }
  &-item-circle_passed{
    opacity: 1;
    animation: slideIn 1s linear forwards;
  }
}
@media(max-width:900px){
  .sidebar {
    max-width: 60px;
  }
}
@keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
}

@keyframes slideIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
}

.sidebar__image{
  overflow-x: hidden;
}
.v-navigation-drawer--temporary{
    box-shadow: none;
  }
@media(max-width:900px){
  .sidebar__image{
    overflow-y: hidden;
  }
}
:deep(.v-navigation-drawer__content) {
  display: flex !important;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto !important;
  .v-btn--icon.v-btn--density-default{
    box-shadow: none !important;
  }
}
.v-navigation-drawer__scrim{
  width: auto;
}
.tracking-normal{
  letter-spacing: normal;
}
</style>