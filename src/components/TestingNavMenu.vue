<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGeneralStore } from "@/stores/generalStore";
import navItems from "@/helpers/testingNavHelper.js";

const generalStore = useGeneralStore();
const items = ref(navItems)

const changeProgressModelActive = () => {
    generalStore.toggleProgressModelActive();
};
const open = ref([]);

const onItemClick = (title) => {
  if (open.value.includes(title)) {
    open.value = [];
  } else {
    open.value = [title];
}
};
</script>

<template>
  <v-card class="mx-auto index-1" max-width="280">
    <a class="text-center my-3 mt-4 d-block" @click="changeProgressModelActive">
      {{ generalStore.progressModelActive ? "Disable" : "Enable" }} Loan Progress Routing
    </a>
    <v-list :opened="open">
      <v-list-group
        v-for="(item, index) in items"
        :key="index"
        :value="item.title"
        no-action
        class="scrolling-item"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" @click="onItemClick(item.title)">
            <div>
              <v-list-item-title>
                {{ item.title.replace(/([a-z])([A-Z])/g, "$1 $2") }}
              </v-list-item-title>
            </div>
          </v-list-item>
        </template>

        <v-list-item
          v-for="(child, childIndex) in item.items"
          :key="childIndex"
          :class="['pl-10', $route.name === child.route ? 'list-item-shadowed' : '']"
        >
          <div class="link-item">
            <router-link :to="{ name: child.route }" class="text-black--text">
              <v-list-item-title>
                {{ child.title.replace(/([a-z])([A-Z])/g, "$1 $2") }}
              </v-list-item-title>
            </router-link>
          </div>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<style lang="scss" scoped>
.index-1 {
  z-index: 1;
}

.scrolling-item {
  &:deep(.v-list-group__items) {
    max-height: 250px;
    overflow-y: auto;
    .v-list-item{
      padding: 0 16px 0 40px !important
    }
  }
}

:deep(.list-item-shadowed) {
  background-color: #ededed;
  .v-list-item-title{
    font-weight: 600;
  }
}

.link-item {
  a {
    text-decoration: none;
  }
  .router-link-exact-active {
    font-weight: 600;
  }
}
:deep(.v-list-item--active){
  color: #023da7
}
</style>
