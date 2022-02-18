export default {
  capitaliseFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  hyphenToCamelCase: (hyphenated) => {
    return hyphenated.replace(/-([a-z])/g, (string) => {
      return string[1].toUpperCase();
    });
  },
};
