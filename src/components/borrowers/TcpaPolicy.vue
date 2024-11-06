<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["closeDialog"]);

const closeDialog = () => {
  emit("closeDialog");
};
</script>

<template>
  <v-card>
    <v-card-title class="headline d-flex card-title bg-gray">
      TCPA Communication Policy
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog" class="">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <p class="text-gray fs-14">
          By consenting to this TCPA Communication Policy and agreeing to telephone
          contact and messaging notifications for telemarketing purposes, you agree that
          Standard Mortgage Capital our assigns, successors, servicing agents, or
          lender/real estate partners may use SMS notifications, calls using artificial or
          prerecorded voice messages and automatic dialing technology for all purposes not
          prohibited by applicable law for any number or electronic or physical address
          (including email) that you have provided. This includes authorizing Standard
          Mortgage Capital and/or its affiliates to contact you regarding the advertising
          or telemarketing of our products and services. You certify, warrant, and
          represent that the telephone numbers that you have provided to us are your
          contact numbers. Your consent, if provided, will be effective even if the number
          you have provided is registered on any state or federal DO-Not-Call (DNC) list.
          This consent for telemarketing calls and text shall remain in effect until you
          revoke it. You may revoke your consent at any time. Your consent to
          telemarketing calls and texts may be revoked by following any of the unsubscribe
          methods described below or by any other method that ensures we receive the
          revocation. You understand that consent is not a condition of purchase or
          required to obtain a loan.
        </p>
        <br />
        <p class="text-gray fs-14">
          STANDARD MORTGAGE CAPITAL AND OUR AGENTS, REPRESENTATIVES, AFFILIATES,
          LENDER/REAL ESTATE PARTNERS, AND ANYONE CALLING ON BEHALF MAY USE SUCH MEANS OF
          COMMUNICATION DESCRIBED IN THIS SECTION EVEN IF YOU WILL INCUR COSTS TO RECEIVE
          SUCH PHONE MESSAGES, TEXT MESSAGES, E-MAILS, OR OTHER MEANS.
        </p>
        <br />
        <h2>Call Recording</h2>
        <p class="text-gray fs-14">
          You agree that Standard Mortgage Capital and our agents, representatives,
          affiliates, lender/real estate partners, or anyone calling on our behalf may
          contact you on a recorded line.
        </p>
        <br />
        <ol class="">
          <li>
            <h3>How to Unsubscribe:</h3>
            <p class="text-gray fs-14">
              You may revoke your consent to receive phone calls, other than to service
              your account or collect any amounts you may owe, by calling us at
              (800) 488-0361 or by logging into your account and changing
              your Communication Preferences. You may withdraw your consent to receive SMS
              Account Notifications by replying with STOP, END, CANCEL, UNSUBSCRIBE, or
              QUIT or by calling us at (800) 488-0361 We may treat your
              provision of an invalid phone number or subsequent malfunction of a
              previously valid mobile phone number as a withdrawal of your consent to
              receive SMS Account Notifications or calls.
            </p>
            <br />
          </li>
          <li>
            <h3>To request additional information contact us by telephone at</h3>
            <p class="text-gray fs-14">(800) 488-0361.</p>
          </li>
        </ol>
        <p class="text-gray fs-14">Standard Mortgage Capital, LLC</p>
        <p class="text-gray fs-14">10200 West State Road 84 #104</p>
        <p class="text-gray fs-14">Davie, FL 33324</p>
        <p class="text-gray fs-14">(800) 488-0361</p>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style scoped>
h2,
h3 {
  font-weight: 700;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}
p{
    margin-bottom: 16px;
}
ol{
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  padding-left: 24px;
}
.card-title{
    align-items: center;
    padding: 16px 24px 10px;
    font-size: 24px;
    flex-wrap: wrap;
    word-break: break-all;
    white-space: break-spaces;
    line-height: 32px;
    letter-spacing: normal;
}
/* .title-text{
    word-break: break-all;
} */
.bg-gray {
    background-color: #e0e0e0 !important;
    border-color: #e0e0e0 !important;
}
.text-gray {
    color: rgba(0, 0, 0, 0.6);
}
.fs-14{
    font-size: 14px;
    line-height: 22px;
    letter-spacing: normal;
}
.v-card-text{
    padding: 0px 24px 20px !important;
}
.v-btn{
    box-shadow: none !important;
    background: transparent !important;
    width: 36px;
    height: 36px;
}
.v-btn:hover{
    background: transparent !important;;
}
.v-icon{
    height: 24px;
    font-size: 24px;
    width: 24px;
    color: rgba(0, 0, 0, 0.6);
}
.v-btn__overlay, v-btn__underlay{
    display: none !important;;
}
.v-container{
  padding: 12px;
}

</style>
