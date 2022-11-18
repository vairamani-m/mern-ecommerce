require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
const uploadFile = require('./routes/upload')
const productRouter = require('./routes/productRouter')
const paymentRouter = require('./routes/paymentRouter')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles:true
}));

app.use('/user', userRouter)
app.use('/api', categoryRouter)
app.use('/api', uploadFile)
app.use('/api', productRouter)
app.use('/api', paymentRouter)

// connect to mongodb
const URI = process.env.MONGODB_URL;
module.exports = mongoose.connect(URI, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) throw err;
    console.log('Connected to MongoDB');
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

app.get('/', (req, res)=>{
    res.json({message:"Welcome To My E-Commerce Site"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log('Server is running on port',PORT);
})
