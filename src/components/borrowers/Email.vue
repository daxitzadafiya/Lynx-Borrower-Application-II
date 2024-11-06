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
const emailRegex = ref(/[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/)
const isValidEmail = computed(()=>{
  return(
    currentBorrower.value?.Email == '' || 
    currentBorrower.value?.Email == null ||
    !emailRegex.value.test(currentBorrower.value.Email)
  )
});
const updateBorrower = (event,data) => {
  emit('updateBorrower',{...data,value:event.target.value})
};
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter your Email Address</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <TextBox
            :isRequired="true"
            placeholder="Email Address"
            :isEmail="true"
            @input="updateBorrower($event,{ prop: 'Email'})"
            :value="currentBorrower?.Email"
          />
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isValidEmail"></NavigationButtons>
    </div>
  </div>
</template>