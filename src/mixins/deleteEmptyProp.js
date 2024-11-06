export function deleteEmptyProp() {
    const deleteEmptyPropValue = (obj, prop) => {
        if (!obj[prop] && Object.keys(obj).includes(prop)) delete obj[prop];
    };

    const deletePropWithCondition = (object, condition, [...deletions]) => {
        deletions.forEach(i => {
            if (condition) {
                delete object[i];
            }
            deleteEmptyProp(object, i)
        })
    }
    return { deleteEmptyPropValue, deletePropWithCondition };
};
