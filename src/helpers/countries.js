import { countries } from "@/models/countries";

export default {
    getCountryShortName(longName) {
        const countryInfo = countries.find(item => item.longName === longName);
        return countryInfo ? countryInfo.shortName : longName;
    },
    getCountryLongName(shortName){
        const countryInfo = countries.find(item => item.shortName === shortName);
        return countryInfo ? countryInfo.longName : shortName;
    }

}