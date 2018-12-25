var isRealString = (str) => {
  return typeof str === "string" && str.trim().length >0;
} // return true for string and false for non-string

module.exports = {isRealString};
