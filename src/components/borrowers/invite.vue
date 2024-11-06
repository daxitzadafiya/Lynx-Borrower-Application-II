<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { phone } from "@/mixins/phoneFormat";
import { number } from "@/mixins/onlyNum";

const { getFormattedPhone } = phone();
const { isOnlyNum } = number();
const isNewInvitation = ref(true);
const invitationToken = ref("");
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const Invitee = ref({
  FirstName: "",
  LastName: "",
  Email: "",
  Phone: "",
  BorrowerType: "Spouse",
  WillOccupyProperty: true,
  LiveAtSameAddress: true,
});
const Message = ref("");
const selectedInvite = ref("");
const emailRegex = ref(
  /[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
);
const invitations = ref(borrowersStore.invitations);

const isShowModal = computed({
  get: () => borrowersStore.isVisible,
  set: (val) => {
    borrowersStore.isModalVisible = val;
  }
});

const types = ref([
  {
    title: "Spouse",
  },
  {
    title: "Relative",
  },
  {
    title: "Other",
  },
]);
let imageList = await Promise.all([
  import("@/assets/images/borrowers/spouse.svg"),
  import("@/assets/images/borrowers/relative.svg"),
  import("@/assets/images/borrowers/other.svg"),
]);
types.value.map((status, index) => (status.src = imageList[index].default));
onMounted(async () => {
  setDefaultInvitationData();
});

watch(
  () => borrowersStore.invitations,
  (newValue) => {
    invitations.value = newValue
    setDefaultInvitationData()
  },
  { deep: true }
)


const onHandleClose = () => {
  borrowersStore.onToggle(false);
  generalStore.toggleIsOnlay({
    isOnlay: false,
  });
};

const validatePhone = (e) => {
  const target = e.target;
  if (target.value.length === 14 && e.keyCode !== 13) {
    e.preventDefault();
    return false;
  }
  return isOnlyNum(e);
};

const sendInvitationAndClose = async () => {
  Invitee.value.Phone = Invitee.value.Phone.replace(/\D/g, "");
  await borrowersStore.inviteBorrower({
    Invitee: Invitee.value,
    Message: Message.value,
  });
  borrowersStore.onToggle(false);
  generalStore.toggleIsOnlay({ isOnlay: false });
};

const resendSelectedInvitation = async () => {
  await borrowersStore.resendInvitation({
    Invitee: Invitee.value,
    Message: Message.value,
    InvitationToken: invitationToken.value,
  });
  borrowersStore.onToggle(false);
  generalStore.toggleIsOnlay({ isOnlay: false });
};

const cancelSelectedInvitation = async () => {
  await borrowersStore.cancelInvitation(invitationToken.value);
  setDefaultInvitationData();
  borrowersStore.onToggle(false);
  generalStore.toggleIsOnlay({ isOnlay: false });
};

const setInvite = (value) => {
  if (value !== "New Invitation") {
    selectedInvite.value = value;
    const index = invitationsNames.value.indexOf(value);
    Invitee.value = { ...invitations.value[index].Invitee };
    invitationToken.value = invitations.value[index].InvitationToken;
    Message.value = invitations.value[index].Message;
    isNewInvitation.value = false;
  } else {
    setEmptyData();
    selectedInvite.value = "New Invitation";
  }
};

const invitationsNames = computed(() => {
  if (invitations.value.length) {
    const invitationsNames = invitations.value.map(
      (item) => `${item.Invitee.FirstName} ${item.Invitee.LastName}`
      );
      return [...invitationsNames, "New Invitation"];
    }
  });

const formatted = computed(() => {
  if (Invitee.value.Phone) {
    return getFormattedPhone(Invitee.value.Phone);
  }
  return "";
});

const isDisabled = computed(() => {
  return (
    !Invitee.value.FirstName ||
    !Invitee.value.LastName ||
    !Invitee.value.Phone ||
    !Invitee.value.Email ||
    !emailRegex.value.test(Invitee.value.Email)
  );
});

const setDefaultInvitationData = () => {
  if (invitations.value.length) {
    Invitee.value = { ...invitations.value[0].Invitee };
    Message.value = invitations.value[0].Message;
    invitationToken.value = invitations.value[0].InvitationToken;
    selectedInvite.value = invitationsNames.value[0];
    isNewInvitation.value = false;
  } else {
    setEmptyData();
  }
};

const setEmptyData = () => {
  Invitee.value = {
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    BorrowerType: "Spouse",
    WillOccupyProperty: true,
    LiveAtSameAddress: true,
  };
  invitationToken.value = "";
  Message.value = "";
  selectedInvite.value = "";
  isNewInvitation.value = true;
};
</script>
<template>
  <v-dialog class="dialog" v-model="isShowModal" activator="parent" max-width="650" persistent>
    <template v-slot:default="{}">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center popup__title">
          <span class="popup__title-text">Invite a Co-Borrower</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            class="popup__close_icon"
            @click="onHandleClose"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text-block text-black--text invitation__main">
          <v-row class="invitation__pending" v-if="invitations.length">
            <v-col class="invitation__label mb-2" sm="4" cols="12"
              >Pending Invitations</v-col
            >
            <SelectBox
              :value="selectedInvite"
              :items="invitationsNames"
              @change="setInvite"
              :mdVal="8"
            ></SelectBox>
          </v-row>
          <p class="invitation__subtitle pb-2">
            Please let us know who you would like to invite as a co-borrower on this loan
          </p>
          <v-form fast-fail="fast-fail"> 
            <v-btn-toggle class="btnToggleGroup" v-model="Invitee.BorrowerType" @change="Invitee.BorrowerType = item.title">
              <v-row class="form-container">
                <ToggleCard
                  v-for="({ src, title }, index) in types"
                  :key="index"
                  :value="title"
                >
                  <inline-svg
                    :src="src"
                    :class="title === 'None' ? 'stroked' : ''"
                  ></inline-svg>
                  <p>{{ title }}</p>
                </ToggleCard>
              </v-row>
            </v-btn-toggle>
          </v-form>
          <v-row class="text-block__row my-0">
            <TextBox
              placeholder="First Name"
              :isRequired="true"
              :mdVal="6"
              :value="Invitee.FirstName"
              @onChange="(val) => (Invitee.FirstName = val)"
            ></TextBox>
            <TextBox
              placeholder="Last Name"
              :isRequired="true"
              :mdVal="6"
              :value="Invitee.LastName"
              @onChange="(val) => (Invitee.LastName = val)"
            ></TextBox>
            <TextBox
              placeholder="Email"
              :isRequired="true"
              :isEmail="true"
              :mdVal="6"
              :value="Invitee.Email"
              @onChange="(val) => (Invitee.Email = val)"
            ></TextBox>
            <TextBox
              placeholder="Cell Phone"
              :isRequired="true"
              @keypress="(val) => validatePhone(val)"
              :mdVal="6"
              :value="formatted"
              @onChange="(val) => (Invitee.Phone = val)"
            >
            </TextBox>
          </v-row>
          <v-row class="invitation__row">
            <v-col class="invitation__col py-0" sm="12" cols="12">
              <span class="invitation__label"
                >Will the co-borrower occupy the subject property?</span
              ></v-col
            >
            <v-col class="invitation__col" sm="3" cols="6">
              <v-row class="invitation__radios">
                <div class="invitation__radio">
                  <Radio
                    :value="Invitee.WillOccupyProperty"
                    @change="Invitee.WillOccupyProperty = !Invitee.WillOccupyProperty"
                  ></Radio>
                </div>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="invitation__row">
            <v-col class="invitation__col py-0" sm="12" cols="12">
              <span class="invitation__label"
                >Does the co-borrower live at the same address as you?</span
              ></v-col
            >
            <v-col class="invitation__col" sm="3" cols="6">
              <v-row class="invitation__radios">
                <div class="invitation__radio">
                  <Radio
                    :value="Invitee.LiveAtSameAddress"
                    @change="Invitee.LiveAtSameAddress = !Invitee.LiveAtSameAddress"
                  ></Radio>
                </div>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="invitation__row">
            <TextBox
              placeholder="Message to co-borrower"
              :value="Message"
              :smVal="12"
              @onChange="(val) => (Message = val)"
            ></TextBox>
          </v-row>
        </v-card-text>

        <v-divider class="mt-5"></v-divider>
        <div class="invitation__button" v-if="isNewInvitation">
          <div class="invitation_desktop-button">
            <CustomButton
              value="Send Invitation"
              customClass="primary-button"
              @onHandleClick="sendInvitationAndClose"
              :isDisabled="isDisabled"
            ></CustomButton>
          </div>
          <div class="invitation_mobile-button">
            <CustomButton
              value="Send Invitation"
              customClass="primary-button"
              width="200px"
              @onHandleClick="sendInvitationAndClose"
              :isDisabled="isDisabled"
            ></CustomButton>
          </div>
        </div>
        <div class="invitation__buttons" v-else>
          <CustomButton
            value="Resend Invitation"
            customClass="primary-button"
            @onHandleClick="resendSelectedInvitation"
          ></CustomButton>
          <CustomButton
            value="Cancel Invitation"
            customClass="primary-button"
            @onHandleClick="cancelSelectedInvitation"
          ></CustomButton>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>
<style lang="scss" scoped>
.popup__title {
  background-color: $primary;
}

.popup__title-text,
.popup__close_icon {
  color: $white;
}

.popup__buttons {
  width: 100%;
  padding: 15px 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

:deep(.v-card-text) {
  padding-bottom: 0px !important;
}

.v-btn-group--density-default.v-btn-group {
  height: auto !important;
}

:deep(.itemContainer .cardBtn.v-btn--active.v-btn) {
  border-radius: 7px;
}

.invitation {
  width: 100%;
  max-width: 610px;

  &__main {
    padding: 20px 30px;
  }

  &__pending {
    align-items: center;
  }

  &__menu {
    height: 65px;
    position: relative;

    &:deep(input) {
      display: none !important;
    }
  }

  &__title {
    background-color: $primary;
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 30px;
  }

  &__main {
    padding: 20px 30px;
  }

  &__subtitle {
    font-size: 16px;
    margin-bottom: 20px;
  }

  &__radios {
    align-items: center;
    justify-content: space-around;
  }

  &__label {
    font-size: 16px;
  }

  &__buttons {
    display: flex;
    justify-content: center;
    margin: 20px 0;

    &:deep(.button) {
      margin: 0 10px;
    }
  }

  &__button {
    width: 100%;
    margin: 20px 0;
  }

  &_desktop-button {
    margin: 0 auto;
    width: 152px;
  }

  &_mobile-button {
    margin: 0 auto;
    width: 200px;
    display: none;
  }
}

.status-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 22px;
  cursor: pointer;

  &__title {
    font-size: 18px;
    margin-top: 10px;
    color: $icon-gray;
    font-weight: bold;
  }

  &_selected {
    border: 2px solid $tile-selected-outline-color;
    background-color: white;

    .status-card__title {
      color: $primary;
    }
  }
}

@media (max-width: 760px) {
  .invitation {
    max-width: 90%;
  }
}

@media (max-width: 450px) {
  .invitation {
    &__title {
      padding: 10px 10px 10px 15px;
    }

    &__main {
      padding: 30px 15px;
    }

    &__buttons {
      &:deep(.button) {
        margin: 0 5px;
      }
    }

    &_padding-0-col {
      padding-top: 0;
      padding-bottom: 0;
    }

    &_desktop-button {
      display: none;
    }

    &_mobile-button {
      display: block;
    }
  }

  .cards {
    margin-bottom: 10px;
  }
}

.invitation__subtitle {
  margin-bottom: 0;
}

.invitation__radios {
  justify-content: start;
}

.btnToggleGroup .form-container {
  padding: 10px 10px;
}

:deep(.v-selection-control) {
  flex: auto;
}

:deep(.v-selection-control-group) {
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: 10px;

  .v-input__details {
    display: none;
  }
}
.dialog{
  overflow-y: hidden;
}
.dialog .invitation__main{
  overflow-y: auto
}
</style>
