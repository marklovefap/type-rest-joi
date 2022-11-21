import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { config } from './config/config'
import Logging from './library/Logging'
import authorRoutes from './routes/Author'
import bookRoutes from './routes/Book'
const app = express()

mongoose
    .connect(config.mongo.url)
    .then(() => {
        console.log('DB connected'),
        startServer()
    })
    .catch((error) => {
        console.log(error)
    })


const startServer = () => {
    
    // log
    app.use((req, res, next) => {
        console.log(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

        res.on('finish', () => {
            console.log(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`)
        })
        
        next()
    })

    // set data
    app.use(express.urlencoded({ extended: true}))
    app.use(express.json())

    // set header
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        
        if(req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
            return res.status(200).json({})
        }
        
        next()
    })

    // routes
    app.use('/authors', authorRoutes)
    app.use('/books', bookRoutes)
    
    // health
    app.get('/ping', (req, res, next) => {
        res.status(200).json({ message: 'pong' })
    })
    
    //set error
    app.use((req, res, next) => {
        const error = new Error('not found')
        console.log(error)

        return res.status(404).json( {message: error.message})
    })

    // create server
    http.createServer(app).listen(config.server.port, () => {
        console.log(`Server is running on port ${config.server.port}`)
    })
}