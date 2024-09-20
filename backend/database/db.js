import mongoose from "mongoose";

const connectDb = async () =>  {
    try {
        await mongoose.connect(process.env.MONGO_URL, {dbName: "Connect",});
        console.log("Mongodb Connected");
    } catch (error) {
        console.log(error);
    }

}

export default connectDb;