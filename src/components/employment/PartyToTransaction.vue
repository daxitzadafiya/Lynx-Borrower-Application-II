<script setup>
import PartyToTransaction from "@/components/images/employment/PartyToTransaction.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { useRoute } from "vue-router";

const statusType = ref("Current");
const classificationType = ref("Primary");
const routePrepend = ref("");
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const route = useRoute();

const setRelationship = (bool) => {
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return setAdditionalEmploymentRelationship(bool);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const Employment = borrowersStore.getBorrowerEmployment().map((item) => {
      if (
        item.EmploymentClassificationType === classificationType.value &&
        item.EmploymentStatusType === statusType.value
      ) {
        item.SpecialBorrowerEmployerRelationshipIndicator = bool;
      }
      return item;
    });
    borrowersStore.updateBorrower({ prop: "Employment", value: Employment });
  } else {
    borrowersStore.updateBorrower({
      prop: "Employment",
      value: [
        ...borrowersStore.getBorrowerEmployment(),
        {
          EmploymentStatusType: statusType.value,
          EmploymentClassificationType: classificationType.value,
          SpecialBorrowerEmployerRelationshipIndicator: bool,
        },
      ],
    });
  }
};

const setAdditionalEmploymentRelationship = (bool) => {
  let additional = [...employmentStore.getAdditionalEmployments()];
  additional[employmentStore.getAdditionalEmploymentIndex()] = {
    ...currentEmployment.value,
    SpecialBorrowerEmployerRelationshipIndicator: bool,
  };
  const filtered = borrowersStore.getBorrowerEmployment().length
    ? borrowersStore
        .getBorrowerEmployment()
        .filter((item) => item.EmploymentClassificationType !== "Secondary")
    : [];
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [...filtered, ...additional],
  });
};

const handleRouteMeta = () => {
  const { status, classification } = route.meta;
  statusType.value = status;
  classificationType.value = classification;
  if (status !== "Current" || classification !== "Primary") {
    routePrepend.value =
      status !== "Current" ? `${status.toLowerCase()}-` : "additional-";
  }
};

const currentEmployment = computed(() => {
  if (classificationType.value === "Secondary") {
    return (
      employmentStore.getAdditionalEmployments()[
        employmentStore.getAdditionalEmploymentIndex()
      ] || {
        EmploymentClassificationType: "Secondary",
      }
    );
  }
  if (borrowersStore.getBorrowerEmployment().length) {
    const employment = borrowersStore
      .getBorrowerEmployment()
      .find(
        (item) =>
          item.EmploymentClassificationType === classificationType.value &&
          item.EmploymentStatusType === statusType.value
      );
    return employment || {};
  }
  return {};
});

const mainTitleVerb = computed(() => {
  return route.meta.status === "Previous" ? "Were" : "Are";
});

const nextRoute = computed(() => {
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return "employmentandincome/additional-employment-details";
  } else {
    return `employmentandincome/${routePrepend.value}job-details`;
  }
});

const specialBorrowerEmployerRelationshipIndicatorValue = computed(() => {
  if (
    currentEmployment.value.EmployedByFamilyMember === null ||
    currentEmployment.value.EmployedByPartyToTransaction === null
  ) {
    return null;
  } else {
    return (
      currentEmployment.value.EmployedByFamilyMember ||
      currentEmployment.value.EmployedByPartyToTransaction
    );
  }
});

onBeforeMount(() => {
  handleRouteMeta();
});
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        {{ mainTitleVerb }} you employed by a family member, property seller, real estate
        agent, or other party to the transaction?
      </div>
      <PartyToTransaction />
      <v-form class="my-5">
        <AgreeToggle
          :value="specialBorrowerEmployerRelationshipIndicatorValue"
          @input="setRelationship"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :RequestedNextPath="nextRoute"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    margin: 20px 0;
    max-height: 375px;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  padding: 0;
  overflow: visible;
}
</style>
