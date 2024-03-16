const mongoose = require('mongoose');
const express = require('express');
const Book = require('./models/bookModel');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/addbook', async (req, res) => {
    try{
        const book =await Book.create(req.body)
        res.status(201).json(book)
    }catch(err){
        console.log(err);
        res.status(400).json({message:'Something went wrong'});
    }
    });
app.get('/getbooksdetails', async (req, res) => {
    try {
            let query = {};
    
            // Extract search parameters from query string
            const { title, author, genre } = req.query;
    
            // Construct MongoDB query based on search parameters
            if (title) {
                query.title = { $regex: new RegExp(title, 'i') }; // Case-insensitive regex search for title
            }
            if (author) {
                query.author = { $regex: new RegExp(author, 'i') }; // Case-insensitive regex search for author
            }
            if (genre) {
                query.genre = { $regex: new RegExp(genre, 'i') }; // Case-insensitive regex search for genre
            }
    
            // Find books based on the constructed query
            const books = await Book.find(query);
    
            // Return the search results
            res.status(200).json(books);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: 'Something went wrong' });
        }
    });
    app.get('/getbooks', async (req, res) => {
        try {
            let query = {};
    
            // Check if query parameters for filtering are present
            if (req.query.title) {
                query.title = { $regex: new RegExp(req.query.title, 'i') }; // Case-insensitive regex search for title
            }
            if (req.query.author) {
                query.author = { $regex: new RegExp(req.query.author, 'i') }; // Case-insensitive regex search for author
            }
            if (req.query.genre) {
                query.genre = { $regex: new RegExp(req.query.genre, 'i') }; // Case-insensitive regex search for genre
            }
    
            const books = await Book.find(query);
            res.status(200).json(books);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: 'Something went wrong' });
        }
    });
    app.get('/getbook', async (req, res) => {
        try {
            let query = {};
    
            // Check if minimum and maximum price query parameters are provided
            if (req.query.minPrice && req.query.maxPrice) {
                // Convert the query parameters to numbers
                const minPrice = parseFloat(req.query.minPrice);
                const maxPrice = parseFloat(req.query.maxPrice);
    
                // Add price filter to the query
                query.price = { $gte: minPrice, $lte: maxPrice };
            }
    
            // Execute the query
            const books = await Book.find(query);
    
            res.status(200).json(books);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Something went wrong' });
        }
    });
app.delete('/deletebook/:id', async (req, res) => {
    try{
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book){
            res.status(404).json({message:'Book not found ${id}'});
        }
        res.status(200).json(book);
    }catch(err){
        console.log(err);
        res.status(400).json({message:'Something went wrong'});
    }
});
app.put('/updatebook/:id', async (req, res) => {
    try{
        const book = await Book.findByIdAndUpdate(req.params.id, req.body);
        if(!book){
            res.status(404).json({message:'Book not found ${id}'});
        } 
        const updatebook=await Book.findById(req.params.id);
        res.status(200).json(updatebook);
    }catch(err){
        console.log(err);
        res.status(400).json({message:'Something went wrong'});
    }
});

mongoose.set("strictQuery", false);

mongoose.connect('mongodb://localhost:27017/BookStore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to local MongoDB');
    app.listen(3001, () => {
      console.log(`Node API app is running on port 3001`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to local MongoDB:', error);
  });

