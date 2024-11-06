<script setup>
import { computed, onMounted, ref } from "vue";
import CustomButton from "../core-components/CustomButton.vue";
import TextBox from "../core-components/TextBox.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const resetData = ref({ username: "", password: "", resetToken: "", applicationId: 2 });
const isShowPass = ref(false);
const passwordCopy = ref("");
const isShowPassCopy = ref(false);
const route = useRoute();
const userStore = useUserStore();

const reset = async () => {
  await userStore.resetPass({ ...resetData.value });
};

const isDisabled = computed(() => {
  return (
    !resetData.value.username ||
    !resetData.value.password ||
    !passwordCopy.value ||
    resetData.value.password !== passwordCopy.value
  );
});

const progress = computed(() => {
  const capitalRegex = /(?=.*[A-Z])/;
  const nonAlphaNumRegex = /(?=.*[-+_!@#$%^&*.,?])/;
  if (resetData.value.password.length) {
    const isCapital = capitalRegex.test(resetData.value.password);
    const isNonAlpha = nonAlphaNumRegex.test(resetData.value.password);
    if (!isCapital && !isNonAlpha) {
      return 30;
    } else if ((isCapital && !isNonAlpha) || (isNonAlpha && !isCapital)) {
      return 50;
    } else {
      return 100;
    }
  }
  return 0;
});

const color = computed(() => {
  return ["error", "warning", "success"][Math.floor(progress.value / 40)];
});

onMounted(() => {
  if (route.query) {
    const { resetToken, userName } = route.query;
    resetData.value = {
      username: userName || "",
      resetToken,
      password: "",
      applicationId: 2,
    };
  }
});
</script>
<template>
  <form class="loginForm">
    <h2 class="title text-center">Reset Password</h2>
    <v-row class="mx-0 mt-0">
      <TextBox
        :smVal="12"
        class="px-0"
        style="font-size: 15px"
        :value="resetData.username"
        placeholder="Email/Username"
        :isRequired="true"
        autocomplete="on"
        @onChange="(val) => (resetData.username = val)"
      ></TextBox>
    </v-row>
    <v-row class="mx-0 mt-0">
      <TextBox
        :smVal="12"
        class="px-0"
        style="font-size: 15px"
        :value="resetData.password"
        :type="isShowPass ? 'text' : 'password'"
        placeholder="Password"
        autocomplete="off"
        @onIconClick="isShowPass = !isShowPass"
        :appendIcon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
        :isPassword="true"
        @onChange="(val) => (resetData.password = val)"
      ></TextBox>
    </v-row>
    <v-row
      class="pb-5 mx-0"
      :style="{ height: '4px', position: 'relative' }"
      v-if="resetData.password.length"
    >
      <v-progress-linear
        :model-value="progress"
        :color="color"
        height="4"
        absolute="absolute"
      ></v-progress-linear>
    </v-row>
    <v-row class="mx-0 mt-0">
      <TextBox
        :smVal="12"
        class="px-0"
        style="font-size: 15px"
        :value="passwordCopy"
        :type="isShowPassCopy ? 'text' : 'password'"
        placeholder="Re-Enter Password"
        autocomplete="off"
        @onIconClick="isShowPassCopy = !isShowPassCopy"
        :appendIcon="isShowPassCopy ? 'mdi-eye' : 'mdi-eye-off'"
        :isPasswordCopy="true"
        @onChange="(val) => (passwordCopy = val)"
        :passwordValue="resetData.password"
      ></TextBox>
    </v-row>
    <div class="submit-button mt-5 pb-3">
      <CustomButton
        btnType="submit"
        :isDisabled="isDisabled || resetData.password.length > 8"
        value="Reset Password"
        width="100%"
        height="45px"
        @onHandleClick="reset"
        customClass="primary-button"
      ></CustomButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  &__main-text {
    font-size: 37px;
    margin-bottom: 50px;
  }
  form {
    z-index: 1;
    width: 412px;
    margin-bottom: 20px;
  }
  .v-card {
    padding: 25px 36px 35px 36px;
    .v-text-field > .v-label {
      font-size: 14x;
    }
  }
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    padding: 10px 0 3px 0;
  }
  .subtitle {
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    padding-top: 0;
  }
  .input-label {
    font-size: 15px;
    &__asterisk {
      position: relative;
      top: -3px;
      font-size: 12px;
    }
  }
  .submit-button {
    margin: 38px 0 21px;
  }
  .form-link {
    display: flex;
    justify-content: center;
    font-size: 14px;
    &__item {
      margin-left: 10px;
    }
    &__icon {
      margin-right: 5px;
    }
  }
  @media (max-width: 480px) {
    form {
      width: 360px;
    }
  }
  @media (max-width: 380px) {
    form {
      width: 330px;
    }
  }
  &:deep(.v-progress-linear--absolute) {
    top: -22px;
  }
}

.options {
  width: 100%;
  position: relative;
  &__item {
    width: 50%;
  }
  &__label {
    margin-left: 5px;
    font-size: 14px;
  }
  &_font-12 {
    font-size: 12px;
  }
  &__icon {
    cursor: pointer;
  }
}
:deep(.button) {
  button {
    margin-top: 0px !important;
  }
}
:deep(.primary-button ){
  background: $primary !important;
}
</style>
