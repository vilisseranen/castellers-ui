export default {
  extractDate(timestamp) {
    var options = { year: "numeric", month: "2-digit", day: "2-digit" };
    var date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  },
  extractTime(timestamp) {
    var options = { hour: "2-digit", minute: "2-digit" };
    var time = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat("fr-FR", options).format(time);
  }
};
