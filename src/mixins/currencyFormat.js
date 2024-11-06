export function getFormattedValue(val){
  var initialString = null;
      if (val && val.length != 0) {
        if (val[0] == "-") {
          initialString = "-";
          val = val.substring(1);
        }
      }

      if (initialString != null) {
        if (val) {
          return initialString + val
            ? val.toLocaleString("en-US", { style: "decimal", currency: "USD" })
            : "";
        } else {
          return initialString;
        }
      } else {
        return val
          ? val.toLocaleString("en-US", { style: "decimal", currency: "USD" })
          : "";
      }
}

export function getFormattedValueStatic(val) {
  if (val === null || val === undefined || val === '') {
    return ''
  }

  let strVal = typeof val === 'number' ? val.toString() : val

  let isNegative = false
  if (strVal[0] === '-') {
    isNegative = true
    strVal = strVal.substring(1)
  }

  let numVal = parseFloat(strVal.replace(/,/g, ''))

  if (isNaN(numVal)) {
    return ''
  }

  let formattedVal = numVal.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return isNegative ? '-' + formattedVal : formattedVal
}