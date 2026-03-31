import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import { app } from "./app.js"
import { connectDB } from './db/index.js'

connectDB()
    .then(() => {
        const port = process.env.PORT || 3000
        app.listen(port, () => {
            console.log(`continue working on port ${port}`)
        })
    })
    .catch((err) => {
        console.log("Error while listen time", err)
    })

