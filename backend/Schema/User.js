const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
name:{
    type:String,
    require:true
},
location:{
    type:String,
    require:true
},
email:{
    type:String,
    require:true
},
password:{
    type:String,
    require:true
},
date:{
    type:Date,
    default:Date.now
}
})

module.exports = mongoose.model('user',userSchema,'user')