<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenu = ref(false);
const items = ref([{ title: "Models" }, { title: "Lender" }, { title: "Details" }]);

const { currentLoan, setBroadcast } = useGeneralStore()

const makeAction = (title) => {
    if (!currentLoan) return;
    isMenu.value = !isMenu.value;
    switch (title) {
        case "Models":
            openTechLoanInfo();
            break;
        case "Lender":
            if (router.name !== "lenderloaninfo") {
                router.push("/lenderloaninfo");
            }
            break;
        default:
            if (router.name !== "loandetails") {
                router.push("/loandetails");
            }
    }
}
const openTechLoanInfo = () => {
    if (currentLoan && currentLoan.Id) {
        const routeData = router.resolve(
            `/loan-tech-info/${currentLoan.Id}`
        );
        const channelId = 111;
        setBroadcast(channelId);
        window.open(
            routeData.href,
            "_blank",
            `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, copyhistory=no, left=0, top=0, width=1300px, height=${screen.availHeight -
            70}`
        );
    }
}
const toggleMenu = (event) => {
  event.stopPropagation();
  isMenu.value = !isMenu.value;
};
</script>
<template>
    <div class="models-forms">
        <v-menu width="170" v-model="isMenu" :offset="[10, 10]">
            <template v-slot:activator="{ props }">
                <div v-bind="props">
                    <v-app-bar-nav-icon v-if="!isMenu" @click="toggleMenu"></v-app-bar-nav-icon>
                    <v-btn v-else icon @click="toggleMenu">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </template>
            <v-list class="models-forms__list">
                <v-list-item class="models-forms__item" v-for="(item, i) in items" :key="i"
                    @click="makeAction(item.title)">
                    <v-list-item-title class="models-forms__item-title text-black--text">
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/desktop-header.scss";

.models-forms {
    position: relative;

    &__menu {
        &:deep(.v-menu__content) {
            top: 50px !important;
            left: auto !important;
            right: -5px !important;
            width: 170px;
        }
    }

    &__list {
        padding: 0;
    }

    &__item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.17);

        &:last-child {
            border-bottom: none;
        }
    }

    &__item-title {
        font-size: 14px;
    }
}
</style>