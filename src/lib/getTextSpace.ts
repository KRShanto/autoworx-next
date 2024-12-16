export const getTextSpace = (value: string) => {
  const rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;

  const result = value.replace(rex, "$1$4 $2$3$5");
  return result;
};
