export default {
  clone(obj) {
    if (obj == null || typeof obj !== "object") return obj;
    if (obj instanceof Date) {
      let date = new Date();
      return date.setTime(obj.getTime());
    }
    if (obj instanceof Array) {
      return obj.map(item => this.clone(item));
    }
    if (obj instanceof Object) {
      return Object.keys(obj).reduce((acc, cur) => {
        return { ...acc, [cur]: this.clone(obj[cur]) };
      }, {});
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  },
  cleanObj(object) {
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === "object") {
        this.cleanObj(v);
      }
      if (
        (v && typeof v === "object" && !Object.keys(v).length) ||
        v === null ||
        v === undefined
      ) {
        if (Array.isArray(object)) {
          object.splice(k, 1);
        } else {
          delete object[k];
        }
      }
      if (typeof v === "string" && !v) delete object[k];
    });
    return object;
  }
};
