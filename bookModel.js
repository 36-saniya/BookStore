const mongoose=require('mongoose');
const { type } = require('os');
const booksschem=mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availability:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:false
    }
    },{
    timeStamp:true
});
const Book = mongoose.model('Book', booksschem);
module.exports=Book;