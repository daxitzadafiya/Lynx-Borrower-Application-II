<script setup>
import {computed,defineProps,defineEmits,watch,ref} from 'vue';
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
const isNextDisabled = computed(()=>{
  return(
    currentBorrower.value?.FirstName == '' || 
    currentBorrower.value?.FirstName == null || 
    currentBorrower.value?.LastName == '' || 
    currentBorrower.value?.LastName == null 
  )
});
const updateBorrower = (event,data) => {
  emit('updateBorrower',{...data,value:event.target.value})
};
</script>
<template>
  <div class="borrowers-data">
    <div class="content-container">
      <div class="content-header-container">
        <div class="header-text">
          Please enter your name as it is shown on your driver's license or other legal ID.
        </div>
      </div>
      <v-form fast-fail="fast-fail">
        <v-row class="form-container -m-10">
          
            <TextBox :value="currentBorrower?.FirstName" placeholder="First Name" @input="updateBorrower($event,{ prop: 'FirstName'})"  isRequired/>
            <TextBox :value="currentBorrower?.LastName" placeholder="Last Name" @input="updateBorrower($event,{ prop: 'LastName'})" isRequired/>
            <TextBox :value="currentBorrower?.MiddleName" placeholder="Middle Name" @input="updateBorrower($event,{ prop: 'MiddleName'})"/>
            <TextBox :value="currentBorrower?.SuffixName" placeholder="Suffix" @input="updateBorrower($event,{ prop: 'SuffixName'})"/>
          
        </v-row>
      </v-form>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
      </div>
    </div>
  </div>
</template>
