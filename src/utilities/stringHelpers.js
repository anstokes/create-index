const stringHelpers = {
  capitaliseFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  hyphenToCamelCase: (hyphenated) => {
    return hyphenated.replace(/-([a-z])/g, (string) => {
      return string[1].toUpperCase();
    });
  },
  hyphenToPascalCase: (hyphenated) => {
    const camelCase = stringHelpers.hyphenToCamelCase(hyphenated);

    return camelCase[0].toLowerCase() + camelCase.slice(1, camelCase.length);
  },
  hyphenToSnakeCase: (hyphenated) => {
    return hyphenated.replace(/-([a-z])/g, (letter) => {
      return `_${letter[1].toLowerCase()}`;
    });
  },
};

export default stringHelpers;
