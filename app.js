import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import express from 'express'
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'

const app = express();
dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

app.use('/posts', postRoutes)
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('APP IS RUNNIG')
})


const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected')
    app.listen(PORT)
}).catch(err => {
    console.log(err)
})


