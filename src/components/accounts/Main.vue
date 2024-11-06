<script setup>
import { useBrandingStore } from "@/stores/brandingStore";
import { computed } from "vue";
import Start from "@/components/images/accounts/Start.vue";
import { getLinkToken, addLinkItem } from "@/api/accounts";
import { useGeneralStore } from "@/stores/generalStore";

const brandingStore = useBrandingStore();
const generalStore = useGeneralStore();
const section = computed(() => brandingStore.getBrandingSection("AccountsAndAssets"));

const introSlide = computed(
  () => brandingStore.getIsHostedMode() && section.value && section.value.IntroSlide
);

const title = computed(() => {
  return (
    (introSlide.value && introSlide.value.Title) ||
    "Please take a moment and let us know about the different accounts and assets that you have "
  );
});

const content = computed(() => {
  return brandingStore.getIsHostedMode() && introSlide.value && introSlide.value.Content;
});

const openPlaid = async () => {
  try {
    const linkTokenResponse = await getLinkToken(generalStore.currentLoan.Id);
    const handler = Plaid.create({
      //token: linkToken,
      token: linkTokenResponse.data.Data.link_token,
      onLoad: () => {
        // Optional, called when Link loads
      },
      onSuccess: (publicToken, metadata) => {
        // Send the public_token to your app server.
        // The metadata object contains info about the institution
        // the user selected and the account ID or IDs, if the
        // Account Select view is enabled.

        alert(JSON.stringify(metadata));
        console.log(JSON.stringify(metadata));

        addLinkItem(
          generalStore.currentLoan.Id,
          linkTokenResponse.data.Data.link_token,
          publicToken
        );
      },
      onExit: (err, metadata) => {
        // The user exited the Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
        }
        // metadata contains information about the institution
        // that the user selected and the most recent API request IDs.
        // Storing this information can be helpful for support.
      },
      onEvent: (eventName, metadata) => {
        // Optionally capture Link flow events, streamed through
        // this callback as your users connect an Item to Plaid.
        // For example:
        // eventName = "TRANSITION_VIEW"
        // metadata  = {
        //   link_session_id: "123-abc",
        //   mfa_type:        "questions",
        //   timestamp:       "2017-09-14T14:42:19.350Z",
        //   view_name:       "MFA",
        // }
      },
    });

    handler.open();
  } catch (err) {
    console.error("Error creating link token:", err);
  }
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">{{ title }}</div>
      <div class="titleSecondaryText" v-if="content">{{ content }}</div>
      <div class="titleSecondaryText" v-else>
        If you choose our
        <a href="#" class="underline" @click.prevent="openPlaid">automated system</a> you
        can retrieve your account information directly from your bank. You can however
        enter your information manually if you would prefer.
      </div>

      <Start class="start-svg" />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.start-svg {
  margin: 20px 0px;
}
.underline {
  text-decoration: underline;
}
@media (max-width: $mobile-width) {
  .start-svg {
    height: 100%;
    width: 100%;
  }
}
</style>
