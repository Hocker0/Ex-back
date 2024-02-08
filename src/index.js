import "dotenv/config"
import connectDB from "./db/connection.js";
import { app } from "./app.js";


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is working on port no : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !! ",err);
})