const model = require("../models/todo.js");
const CustomList = model.CustomList;

module.exports.getDate = function() {
  let today = new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"});
  return today;
}

module.exports.getDay = function() {
  let today = new Date().toLocaleDateString("en-US", {weekday: "long"});
  return today;
}

module.exports.getDateShort = function() {
  let today = new Date().toLocaleDateString("en-US", {weekday: "short", month: "numeric", day: "numeric"});
  let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  return today + " " + time;
}
