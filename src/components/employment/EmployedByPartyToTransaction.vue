<script setup>
import PartyToTransaction from "@/components/images/employment/PartyToTransaction.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { useRoute } from "vue-router";

const statusType = ref("Current");
const classificationType = ref("Primary");
const routePrepend = ref("");
const isEmpByAnyone = ref(null);
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const route = useRoute();

const setRelationship = (bool) => {
  isEmpByAnyone.value = bool;
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
        item.EmployedByPartyToTransaction = bool;
        item.SpecialBorrowerEmployerRelationshipIndicator =
          bool || item.EmployedByFamilyMember
            ? bool
            : item.SpecialBorrowerEmployerRelationshipIndicator;
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
          EmployedByFamilyMember: bool,
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
    EmployedByPartyToTransaction: bool,
    SpecialBorrowerEmployerRelationshipIndicator:
      (bool |
        additional[employmentStore.getAdditionalEmploymentIndex()]
          .EmployedByPartyToTransaction) ===
      1,
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
onBeforeMount(() => {
  handleRouteMeta();
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        {{ mainTitleVerb }} you employed by anyone involved in this transaction such as
        real estate agent, property seller, closing agent, builder, etc?
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
        :ConditionsMet="isEmpByAnyone === null ? true : false"
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
