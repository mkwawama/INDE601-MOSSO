// importing modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;  
  
var SongSchema = new Schema({   
    songid: {type: String, required:true, unique:false},
    artist: {type: String, required:false, unique:false},
    location: {type: String, required:false, unique:false},
    userid: {type: String, required:true},
    added_date: {type:Date, default:Date.now},

});
  
// export songschema
 module.exports = mongoose.model("Song", SongSchema);
