<script setup>
import {defineProps,defineEmits,watch,ref} from 'vue';

const props = defineProps({
  currentBorrower: {
      type: Object,
      default: () => {}
    }
});
const currentBorrower = ref(props.currentBorrower)

watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue
  },
  { deep: true }
)

const emit = defineEmits(['updateBorrower'])

const updateBorrower = (event,data) => {
  emit('updateBorrower',{...data,value:event.target.value})
};
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Are there any alternate names by which you are known?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <TextBox placeholder="First Name" :value="currentBorrower?.AlternateFirstName" @input="updateBorrower($event,{ prop: 'AlternateFirstName'})"/>
          <TextBox placeholder="Last Name" :value="currentBorrower?.AlternateLastName" @input="updateBorrower($event,{ prop: 'AlternateLastName'})"/>
          <TextBox placeholder="Suffix"  :value="currentBorrower?.AlternateSuffixName" @input="updateBorrower($event,{ prop: 'AlternateSuffixName'})"/>
      </v-row>
      <div class="navigation-container">
        <NavigationButtons></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>
