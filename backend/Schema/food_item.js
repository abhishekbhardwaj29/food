const mongoose = require('mongoose');

const foodItem = new mongoose.Schema({
    CategoryName: String,
    name: String,
    img: String,
    options: Array,
    description: String
})

module.exports = mongoose.model('food_Item',foodItem, 'food_Item')
