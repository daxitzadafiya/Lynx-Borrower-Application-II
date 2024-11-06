<script setup>
import { ref, defineProps, onMounted, computed, defineEmits } from 'vue';
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import Account from '@/assets/images/account.png'
import { useGeneralStore } from '@/stores/generalStore';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    accountItems: {
        type: Array,
        default: () => []
    },
    address: {
        type: String,
        default: ""
    },
    counter: {
        type: Number,
        default: 0
    }
})
const { toggleTestingNav } = useGeneralStore()
const isInfoOpen = ref(false);
const isAccountOpen = ref(false);
const barHeight = computed(() => {
    return !isInfoOpen.value ? "76px" : "100";
});

const openedStyle = ref({
    height: "330px",
    "z-index": 1000
});
const accountOpenedStyle = ref({ height: "100%" });
const emit = defineEmits(['makeAction']);
const mobileLogo = ref('');
onMounted(async () => {
    mobileLogo.value = await import(`../../assets/images/${import.meta.env.VITE_BRAND}/mobile-logo.png`);
})
</script>
<template>
    <v-app-bar id="appbar" color="primary"
        :height="barHeight"
        :style="[isInfoOpen.value ? (isAccountOpen.value ? accountOpenedStyle.value : openedStyle.value) : '']" dark app
        dense flat>
        <v-container style="padding: 0; height: 100%;">
            <div class="top-block" style="height: 76px; display: flex; align-items: center;">
                <v-app-bar-nav-icon v-if="!isInfoOpen" @click="isInfoOpen = true" :ripple="false"
                    tile></v-app-bar-nav-icon>
                <v-btn v-else icon @click="isInfoOpen = false" :ripple="false" tile style="z-index: 1;">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <img class="mobile-logo" :src="mobileLogo.default" @click="toggleTestingNav" />
            </div>
            <div class="info-blocks" v-if="isInfoOpen">
                <div class="mid-block pb-3">
                    <v-row class="mid-block__address" style="align-items: center;">
                        <div class="d-flex">
                            <v-icon class="item__address-icon header-label-text" aria-hidden="false">mdi-home</v-icon>
                            <span class="item__address" v-html="address"></span>
                        </div>
                    </v-row>
                    <v-divider class="my-4 mb-3" />
                    <v-row class="mid-block__item px-5">
                        <v-col cols="6" v-for="(item, index) in props.items" :key="index" class="px-3">

                            <div v-if="item.data">
                                <span class="item__label header-label-text body-2 font-weight-medium">
                                    {{ item.label }}
                                </span>
                                <v-icon v-if="item.isIcon" class="item__icon header-label-text" aria-hidden="false">
                                    mdi-help-circle
                                </v-icon>
                                <p class="item__data body-2 font-weight-medium">
                                    <span v-if="item.isCurrency">$</span>
                                    <span>
                                        {{ item.isCurrency ? getFormattedValue(+item.data) : item.data }}
                                    </span>
                                    <span v-if="item.isPercent">%</span>
                                </p>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <div class="bottomButtonsContainer" :class="{ 'active': isAccountOpen }">
                        <v-btn @click="isAccountOpen = !isAccountOpen"
                            class="rounded-0 text-none bottom-block py-5 px-5 w-100 accountSettingsBtn justify-between">
                            <div class="d-flex">
                                <img class="ml-3 flex-shrink-0 account__logo" :src="Account" />
                                <div class="flex-grow-1 text-start">Account Settings</div>
                            </div>
                            <v-icon class="rightIcon">mdi-chevron-up</v-icon>
                        </v-btn>
                    <div class="settingsButtonsContainer">
                        <v-btn plain x-large class="rounded-0 text-none bottom-block py-5 px-5"
                            style="align-items: center;" v-for="( item, index) in  accountItems " :key="index"
                            @click="emit('makeAction', { title: item.title })">
                            <!-- {{ item.icon }} -->
                            <i class="account__item-icon material-icons icon-color-main mx-3">{{ item.icon }}</i>
                            <div class="flex-grow-1 text-start">{{ item.title }}</div>
                        </v-btn>
                    </div>
                </div>
            </div>
        </v-container>
    </v-app-bar>

</template>
<style lang="scss" scoped>
@import "@/assets/styles/headers.scss";
@import "@/assets/styles/mobile-header.scss";

#appbar {
    background-color: $primary !important;

    .v-btn {
        &::before {
            background-color: transparent;
        }
    }
}
.rightIcon {
    transform: rotate(90deg);
}

:deep(.mid-block__item) {
    background: $primary !important;
}

:deep(.mid-block__item.px-5) {
    padding: 0 30px !important;
}

:deep(.header-label-text) {
    color: $header-label-text-color !important;
    font-size: 14px;
    font-weight: 600 !important;
}

:deep(.mdi-help-circle){
    color: $header-label-text-color !important;
}

:deep(.v-btn__content) {
    display: flex;
}
</style>