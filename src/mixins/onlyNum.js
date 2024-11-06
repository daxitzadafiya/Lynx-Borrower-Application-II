export function number() {
    const isOnlyNum = (evt, bool, canBeNegative) => {
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (bool && charCode === 46) {
        return true;
      }
      if (canBeNegative && charCode == 45) {
        return true;
      }
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
        return false;
      }
      return true;
    }

    return { isOnlyNum };
};
