import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function dbconnection(){
    mongoose.connect(process.env.DB_CONNECT)
    .then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.log(err);
    });
}


export default dbconnection;
