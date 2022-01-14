const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const fs = require('fs')
const cors = require('cors')

const dotenv = require('dotenv');
dotenv.config();

//Routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//Database connection
mongoose.connect(process.env.MONGO_URI,
    {useNewUrlParser: true}).then(()=>{console.log('database connected')})
mongoose.connection.on("error", err => {console.log(`connection DB error: ${err}`)})
    
app.use(morgan("dev"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});
    
//Routes
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

//Api Routes
app.get('/',(req,res)=>{
    fs.readFile('docs/apiDocs.json', (err, data)=>{
        if(err){
             res.status(400).json({
                error: err 
            })
        }
        const docs = JSON.parse(data)
        res.json(docs)
    })
})

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`Express connected to port: ${port}`);
});