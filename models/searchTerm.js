const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const searchSchema = new mongoose.Schema({
  term : {
    type : String,
    required : 'Search term in required'
  },
  when : {
    type: Date,
    default : Date.now
  }
});

module.exports = mongoose.model('SearchTerm', searchSchema);