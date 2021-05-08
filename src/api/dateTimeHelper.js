export default {
  extractDate(timestamp) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  },
  extractTime(timestamp) {
    const options = { hour: "2-digit", minute: "2-digit" };
    const time = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat("fr-FR", options).format(time);
  }
};
