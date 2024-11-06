import { createPatch, applyPatch } from 'rfc6902'

export default {
  createJsonPatch(baseJsonDoc, changedJsonDoc) {
    const baseFiltered = filterEmptyStrings(baseJsonDoc)
    const changedFiltered = filterEmptyStrings(changedJsonDoc)

    const patch = createPatch(baseFiltered, changedFiltered)

    return patch
  },

  applyJsonPatch(objectToApplyPatch, patches) {
    applyPatch(objectToApplyPatch, patches)
  }
}

function filterEmptyStrings(jsonDoc) {
  if (Array.isArray(jsonDoc)) {
    return jsonDoc.map((obj) => filterEmptyStrings(obj))
  } else if (typeof jsonDoc === 'object' && jsonDoc !== null) {
    const filtered = {}
    for (const [key, value] of Object.entries(jsonDoc)) {
      if (value !== '') {
        filtered[key] = filterEmptyStrings(value)
      }
    }
    return filtered
  } else {
    return jsonDoc
  }
}
