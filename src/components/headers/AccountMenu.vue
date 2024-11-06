<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import accountPng from '@/assets/images/account.png'
import rectangleDown from '@/assets/images/rectangle-down.png'
const props = defineProps({
    accountItems: {
        type: Array,
        default: () => []
    }
});

const isAccountMenu = ref(false);
const emit = defineEmits(['makeAction']);
</script>
<template>
    <div class="account">
        <div class="header-account">
            <v-menu v-model="isAccountMenu" :offset="[10, 10]">
                <template v-slot:activator="{ props }">
                    <div class="header-account-button"  >
                        <span class="account__text">Account</span>
                        <v-icon class="account__logo width">mdi-account-outline</v-icon>
                        <v-icon class="account__open" v-bind="props" :class="{ 'account_reversed': isAccountMenu }">{{ isAccountMenu ? 'mdi-chevron-up active' : 'mdi-chevron-down' }}</v-icon>
                    </div>
                </template>
                <v-list class="account__list">
                    <v-list-item class="account__item"  v-for="(item, i) in accountItems" :key="i"
                        @click="emit('makeAction', { title: item.title })">
                        <i class="account__item-icon material-icons icon-color-main">{{ item.icon }}</i>
                        <v-list-item-title class="account__item-title text-black--text">{{ item.title
                            }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>



<style lang="scss" scoped>
@import "@/assets/styles/desktop-header.scss";

.account {
    position: relative;

    &__menu {
        &:deep(.v-menu__content) {
            top: 35px !important;
            left: auto !important;
            right: -15px !important;
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

    &__item-icon {
        margin-right: 5px;
        font-size: 18px;
    }

    &__item-title {
        font-size: 14px;
    }

    &_reversed {
        &:deep(.v-btn__content) {
            transform: rotate(180deg);
        }
    }

    @media (max-width:$tablet-width) {     
        .header-account{
            height: 31px;
            display: flex;
            align-items: center;
        }
    }

}

:deep(.v-list-item__content){
    display: flex !important;
}
:deep(.account__logo) {
    margin: 0 0.5px 0 7px;
}

</style>