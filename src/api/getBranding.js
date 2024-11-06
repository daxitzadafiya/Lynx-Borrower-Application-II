import config from '@/configs'
import axios from 'axios'

export const getBranding = async () => {
  const response = await axios.get(config.hostedBrandingDataUrl)
  return response.data
}
