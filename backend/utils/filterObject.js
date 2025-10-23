export const filterObject = (obj, excludedFields) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excludedFields.includes(key)),
  );
};
