const millisecondInADay = 86400000;

module.exports = (type) => {
  switch (type) {
    case 1:
      return 3600000; //milisecond
    case 2:
      return 86400000;
    case 3:
      return 86400000 * 30;
    case 4:
      return 86400000 * 90;
    case 5:
      return 86400000 * 180;
    case 6:
      return 86400000 * 365;
    default:
      return 0;
  }
};
