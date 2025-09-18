const express = require('express')

const app = express()
require('./config/database')
const productRouter = require('./routers/productRouter')
const port = process.env.PORT
app.use(express.json())
app.use(productRouter)
app.listen(port,()=>{
    console.log(`app is listening at port: ${port}`);
    
})