export function phone(){
    const getFormattedPhone = (phone) => {
      if (!phone) return "";
      let result = "";
      let cleaned = ("" + phone).replace(/\D/g, "");
      if (cleaned.length < 3) {
        result = "(" + cleaned;
      } else if (cleaned.length === 3) {
        result = "(" + cleaned.slice(0, 3) + ")";
      } else if (cleaned.length > 3 && cleaned.length <= 6) {
        result = "(" + cleaned.slice(0, 3) + ") " + cleaned.slice(3, 6);
      } else {
        result =
          "(" +
          cleaned.slice(0, 3) +
          ") " +
          cleaned.slice(3, 6) +
          "-" +
          cleaned.slice(6);
      }
      return result.length > 14 ? result.slice(0, 14) : result;
    }
    return { getFormattedPhone };
};
