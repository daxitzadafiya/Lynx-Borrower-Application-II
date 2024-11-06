<script setup>
import PageHeader from '@/components/UI/PageHeader.vue'
import Footer from '@/components/UI/Footer.vue'
import Sidebar from '@/components/UI/Sidebar.vue';
import AnimatedSidebar from '@/components/AnimatedSidebar.vue'
import { useGeneralStore } from '@/stores/generalStore';
import { useBrandingStore } from '@/stores/brandingStore';
import { useUserStore } from '@/stores/userStore'
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const generalStore = useGeneralStore();
const brandingStore = useBrandingStore();
const userStore = useUserStore();
const currentActive = ref(0);
const showNavigation = computed(() => generalStore.getShowNavigation());
const showAnimatedNavigation = computed(() => generalStore.getshowAnimatedNavigation());
const list = ref([]);
const steps = ref(1);
const isProgress = ref(true);
const route = useRoute();
const imageImports = [
    { text: "Borrowers", routeName: "borrowers", rootPath: "borrowers", icon: import('@/assets/images/sidebar/borrowers.svg') },
    {
      text: "Loan & Property",
      routeName: "loanandproperty",
      rootPath: "loanandproperty",
      icon: import('@/assets/images/sidebar/loan-property.svg')
    },
    {
      text: "Credit & Liabilities",
      routeName: "credit",
      rootPath: "credit",
      icon: import('@/assets/images/sidebar/credit-liabilities.svg')
    },
    {
      text: "Accounts & Assets",
      routeName: "accountsandassets",
      rootPath: "accountsandassets",
      icon: import('@/assets/images/sidebar/accounts-assets.svg')
    },
    {
      text: "Employment & Income",
      routeName: "employmentandincome",
      rootPath: "employmentandincome",
      icon: import('@/assets/images/sidebar/employment-income.svg')
    },
    {
      text: "Declarations",
      routeName: "declarations",
      rootPath: "declarations",
      isLast: false,
      icon: import('@/assets/images/sidebar/declarations.svg')
    },
    {
      text: "Documents",
      routeName: "documents",
      rootPath: "documents",
      isLast: false,
      icon: import('@/assets/images/sidebar/documents.svg')
    },
    {
      text: "Rates & Offers",
      routeName: "ratesandoffers",
      rootPath: "ratesandoffers",
      isLast: false,
      icon: import("@/assets/images/sidebar/rates-offers.svg")
    },
    // {
    //   text: "Demographics",
    //   routeName: "demographics",
    //   rootPath: "demographics"
    // },
    // {text: 'Details of Transaction', routeName: 'detailsoftransaction', rootPath: 'detailsoftransaction'},   /// Temporarily removed
    {
      text: "Review",
      routeName: "review",
      rootPath: "review",
      isLast: true,
      icon: import('@/assets/images/sidebar/review.svg')
    },
  ]
  const images = await Promise.all(imageImports.map(image => image.icon));
  list.value = imageImports.map((image, index) => ({
    ...image,
    icon: images[index].default,
  }));
  
onMounted(async () => {
  if (userStore.currentUser.userTypeId != 1) {
    if (generalStore.currentLoan == null || generalStore.currentLoan?.StatusId <= 6) {
      list.value = list.value.filter((x) => x.routeName != "documents" && x.routeName != "review");
    }
  }
  window.addEventListener("popstate", () => {
    generalStore.setAppHistoryLength(generalStore.getAppHistoryLength() - 2)
  });

})

const enabledSections = computed(() => {
  if (brandingStore.isHostedMode) {
    const enabledSections = brandingStore.brandingSections.filter((item) => item.Enable);
    const sectionNames = enabledSections.map((item) => item.Name.toLowerCase());
    return list.value.filter((item) => sectionNames.indexOf(item.routeName) !== -1);
  } else {
    return list.value
  }
})

const setActiveSidebarItem = ({ index }) => {
  currentActive.value = index;
};

const setProgressVisibility = ({ name, step }) => {
  if (list.value.length > 0) {
    if (name === "underwriting" || name === "approved") {
      return (currentActive.value = enabledSections.value.length)
    };
    steps.value = +(name && name !== "borrowers" ? enabledSections.value.findIndex((item) => item.routeName === name) + 1 : 1);
    isProgress.value = name !== "borrowers";
    const routePath = route.path
    currentActive.value = enabledSections.value.findIndex((item) => routePath.split("/")[1] === item.rootPath)
  }
};
</script>
<template>
  <div class="home mx-auto">
    <PageHeader />
    <Sidebar v-if="showNavigation" :currentActive="currentActive" :list="enabledSections"
      @setActiveSidebarItem="setActiveSidebarItem" />
    <AnimatedSidebar v-if="showAnimatedNavigation" />
    <div class="main-container">
      <RouterView @setProgressVisibility="setProgressVisibility" />
      <Footer />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  max-width: 1441px;
  max-height: 100%;
}

.home {
  min-height: 100%;
  max-width: 1441px;
  width: 100vw;
  margin: 0 auto;
  display: flex;
  height: fit-content;
  background-color: $container-bg;
  // flex-direction: column;
  box-sizing: border-box;

  &:deep(.v-overlay--absolute) {
    top: 88px;

    @media (max-width: $sm-tablet-width) {
      top: 76px;
    }
  }

  &__container {
    flex-grow: 1;
    min-height: 100%;
    padding: 0 $page-padding;

    @media (max-width: $tablet-width) {
      padding: 0 $tablet-page-padding;
    }

    @media (max-width: $mobile-width) {
      padding: 0 $mobile-page-padding;
    }

    overflow: hidden;
    box-sizing: border-box;
    margin-top: 88px;
    position: sticky;
    top: 88px;
    display: flex;
    flex-direction: column;
  }

  .header {
    left: 0;
    z-index: 20;
  }

  .main-container {
    flex-grow: 1;
    min-height: 100%;
    justify-content: space-between;
    width: 100%;
    padding: 0 $page-padding;

    @media (max-width: $tablet-width) {
      padding: 0 $tablet-page-padding;
    }
    @media(max-width:$sm-tablet-width){
      margin-top: 76px;    
    }

    @media (max-width: $mobile-width) {
      padding: 0 $mobile-page-padding;
    }

    overflow: hidden;
    box-sizing: border-box;
    margin-top: 88px;
    position: sticky;
    top: 88px;
    display: flex;
    flex-direction: column;
    // z-index: 10;
  }

  .greetingsContainer {
    flex-grow: 1;
  }
}
</style>
