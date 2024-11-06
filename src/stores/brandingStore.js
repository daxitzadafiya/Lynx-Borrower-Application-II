import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getBranding } from '@/api/getBranding'
import { toast } from 'vue3-toastify';
import config from '@/configs'
export const useBrandingStore = defineStore('brandingStore', () => {
  const hostedBranding = ref(null)
  const isHostedMode = ref(false)
  const lynxSlogan = ref('Your Trusted Software Partner')
  const brandingBaseUrl  = ref('')
  const setBranding = async () => {
    try {
      const response = await getBranding()
      hostedBranding.value = response.Data.BorrowerApplication;
      brandingBaseUrl.value  = hostedBranding.value?.BrandingPath || config.brandingUrl
    }
    catch (error) {
      toast.error("An error occurred while trying to set Branding. Please try again.");
    }
    finally {
    }
  }

  const brandingSections = computed(() => {
    return hostedBranding.value?.Sections || []
  })

  const getBrandingSection = (sectionName) => brandingSections.value.find(item => item.Name === sectionName);

  const introSlide = () => hostedBranding.value ? hostedBranding.value.IntroSlide : null;

  const getIsHostedMode = () => isHostedMode.value;

  const setIsHostedMode = (payload) => { isHostedMode.value = payload }

  return { hostedBranding, setBranding, brandingSections, getBrandingSection, introSlide, getIsHostedMode, isHostedMode, setIsHostedMode, lynxSlogan, brandingBaseUrl }
})
