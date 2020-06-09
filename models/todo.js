const mongoose = require("mongoose");

var toDoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    comments: String,
    postedDate: String
})

var customListSchema = new mongoose.Schema({
    name: String,
    items: [toDoSchema]
})

var ToDo = mongoose.model("ToDo", toDoSchema);
var CustomList = mongoose.model("CustomList", customListSchema);

module.exports.ToDo = ToDo;
module.exports.CustomList = CustomList;
