const mongoose = require("mongoose");

const convertToMongoDbObjectId = (var_id) => {
  return new mongoose.Types.ObjectId(`${var_id}`);
};

module.exports = { convertToMongoDbObjectId };
