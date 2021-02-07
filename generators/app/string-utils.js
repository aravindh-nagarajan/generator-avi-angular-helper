module.exports = {
  capitalizeFirstLetter: string =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  camelToDashCase: str => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  },
};
