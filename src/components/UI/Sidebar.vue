<script setup>
import { ref, watch, defineProps, onMounted, defineEmits, onBeforeMount } from 'vue';
import PlantsWithHouse from '@/components/images/sidebar/PlantsWithHouse.vue';
import { useBorrowersStore } from '@/stores/borrowersStore'
import { loanPatch } from '@/mixins/loanPatch.js'
import { useRoute } from 'vue-router';
import { useGeneralStore } from '@/stores/generalStore';
import { useBrandingStore } from '@/stores/brandingStore';
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  currentActive: {
    type: Number,
    default: 0
  },
})

// const { saveAndAdvance } = loanPatch();
const drawer = ref(true);
const sideInfo = ref("");
const isExpanded = ref(false);
const isSideInfo = ref(false);
const hamBurgerIcon = ref();
const crossIcon = ref();
const emit = defineEmits(["setActiveSidebarItem"]);
const currentRoute = useRoute();
const generalStore = useGeneralStore();
const { isHostedMode } = useBrandingStore();
const currentBorrowerIndex = ref(useBorrowersStore().currentBorrowerIndex);
const borrowerStore = useBorrowersStore();

watch(
  () => useBorrowersStore().currentBorrowerIndex,
  (newValue) => {
    currentBorrowerIndex.value = newValue;
  },
  { deep: true }
);

const setActiveItem = (index) => {
  emit("setActiveSidebarItem", { index })
};

const setBorrower = (index) => {
  borrowerStore.setCurrentBorrower(index)
  // let newPath = this.getNextNavigablePathForCurrentBorrowerInCurrentSection()
  // if (newPath != null) {
  //   saveAndAdvance(false, newPath, true)
  // }
};

const inviteBorrower = async () => {
  await borrowerStore.getInvitations();
  borrowerStore.onToggle(true);
  generalStore.toggleIsOnlay({
    onlayComponent: "borrower",
    isOnlay: true
  });
};


const windowClicked = (e) => {
  if (!e.target.closest(".sidebar")) {
    toggleSidebarExpand()
  }
}

const toggleSidebarExpand = () => {
  if (!isExpanded.value) {
    window.addEventListener("click", windowClicked)
  } else {
    window.removeEventListener("click", windowClicked)
  }
  isExpanded.value = !isExpanded.value
}

onMounted(async () => {
  const images = await Promise.all([import('@/assets/images/sidebar/hamburger.svg'), import('@/assets/images/sidebar/cross.svg')]);
  hamBurgerIcon.value = images[0].default;
  crossIcon.value = images[1].default;
})

onBeforeMount(() => {
  const routePath = currentRoute.path;
  const index = props.list.findIndex(item => routePath.indexOf(item.rootPath) !== -1);

  if (generalStore.currentLoan && generalStore.currentLoan.StatusId < 4) {
    props.list.pop();
    props.list[props.list.length - 1].isLast = true;
  }

  const event = new CustomEvent('setActiveSidebarItem', { detail: { index } });
  window.dispatchEvent(event);

  const { sideInfo: routeSideInfo } = currentRoute.meta;
  isSideInfo.value = routeSideInfo;
  sideInfo.value = routeSideInfo;
});
</script>
<template>
  <div :class="{ 'sidebar': true, 'sidebar_hosted': isHostedMode }">
    <v-navigation-drawer :class="{ 'isExpanded': isExpanded, navDrawer: true }" v-model="drawer" height="100%">
      <v-list class="listItems">
        <v-list-item v-for="(item, index) in list" :key="index" class="sidebar-list" style="padding: 0; z-index: 1">
          <div class="item-content">
            <div class="item" style="padding-left: 1px">
              <span class="item__circle" :class="{
    'item_active': index === currentActive && index === 0,
    'item_long-line': index === 0 || (index === currentActive && isSideInfo),
    'item_no-line': item.isLast || index === (list.length - 1),
    'item_passed': currentActive > index
  }">
                <div class="progress sidebar-icon-circle" :class="{
    'sidebar-item-circle_active': currentActive === index,
    'sidebar-item-circle_passed': currentActive > index
  }">
                  <div class="tabletIcon" :class="{
    'sidebar-item-circle_active': currentActive === index,
    'sidebar-item-circle_passed': currentActive > index
  }">
                    <inline-svg :src="item.icon" :class="{
    'sidebar-list-item_active': currentActive === index,
    'sidebar-list-item_passed': currentActive > index
  }" />
                  </div>
                </div>
              </span>
              <div class="item__text">
                <router-link :to="{ name: item?.routeName }" class="item__link" @click="setActiveItem(index)">
                  <v-list-item-title class="item__title" :class="{
    'active side-nav-selected-color': currentActive === index,
    'sidebar-nav-passed-color': currentActive > index
  }">
                    <span>{{ item.text }}</span>
                  </v-list-item-title>
                  <div v-if="index === 0" class="item__additional" @click.stop.prevent="() => true">
                    <div v-for="(bor, i) in borrowerStore.Borrowers" :key="i" class="item__name d-flex align-items-center"
                      @click.stop.prevent="setBorrower(i)" :class="{ 'item_active-name': currentBorrowerIndex === i }">
                      <span :class="currentBorrowerIndex === i ? 'item__active-bulletins' : 'item__bulletins'"
                        class="mr-1 d-flex" v-if="bor.FirstName || bor.LastName"></span>
                      {{ bor.FirstName }} {{ bor.LastName }}
                    </div>
                    <div class="item__button" @click="inviteBorrower">
                      Invite Borrower
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </v-list-item>
      </v-list>
      <div class="sidebarExpandBtn">
        <v-btn icon small @click="toggleSidebarExpand">
          <v-icon>mdi-page-layout-sidebar-left</v-icon>
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
  max-width: 292px;

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
    padding: 30px 0px 10px 14px;
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
    .sidebar__bottom-image {
      scale: 1;
    }

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
  z-index: 10;
  height: calc(100vh - 88px);
  position: sticky;
  top: 88px;
  width: 100% !important;
  @media(max-width:$sidebar-tablet-breakpoint){
    max-width: 60px;
  }
  &__image{
    overflow: hidden;
  }
  .v-btn--icon.v-btn--density-default{
    width: 28px !important;
    height: 28px !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }
  .v-navigation-drawer{
    box-shadow: none !important;
  }
  .v-navigation-drawer__scrim{
    position: fixed;
    opacity: 0.46;
  }
}

:deep(.v-navigation-drawer__content) {
  display: flex !important;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;

}
.listItems {
	.item__text {
		.item__button {
			line-height: 15.4px;
		}
		.item__name {
			line-height: 15.4px;
		}
		.item__title {
			line-height: 21.6px;
      letter-spacing: normal;
		}
	}
  .item__circle{
    &::after{
      display: none;
    }
  }
  .item-content{
    position: relative;
    &::after{
      position: absolute;
      content: "";
      background: #969696;
      height: 100%;
      width: 1px;
      top: 0;
      left: 23px;
      z-index: -1;
    }
    .sidebar-item-circle_active{
       background: #f5f8fb !important;
    }
  }
  .v-list-item{
    &:last-child{
      .item-content{
        &::after{
          display: none;
        }
      }
    }
  }
}

</style>
