import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const connectioninstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`connect to db host ${connectioninstance.connection.host}`)
    } catch (error) {
        console.log("error while connection db ",error)
        process.exit(1)
    }
}
