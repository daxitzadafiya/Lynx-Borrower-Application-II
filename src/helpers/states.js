import { states } from "@/models/us-states";

export default {
  getStateInfo(stateCode) {
    return states.find(item => item.PostalAbbreviation === stateCode);
  },
  getStateIndicator(stateCode,indicatorName){
    const stateInfo = states.find(item => item.PostalAbbreviation === stateCode);
    return stateInfo ? stateInfo[indicatorName] : false;
  }
}