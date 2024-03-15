const mongoose = require('mongoose');
const foodCategory = new mongoose.Schema({
    CategoryName:String
})

module.exports = new mongoose.model('food_categore',foodCategory, 'food_categore')