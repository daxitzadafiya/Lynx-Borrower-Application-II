import countriesHelper from '@/helpers/countries'

export function countryHandling() {
  const getCountryName = (shortName) => {
    return countriesHelper.getCountryLongName(shortName)
  }

  const getCountryCode = (longName) => {
    return countriesHelper.getCountryShortName(longName)
  }
  return { getCountryName, getCountryCode }
}
