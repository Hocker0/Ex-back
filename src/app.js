import express from "express"
import cors from "cors"    // used for connect cross origin
import cookieParser from "cookie-parser"   //used for read cookies or cookies operations

const app = express();
// cross origin setup

app.use(cors({
    origin: process.env.CORS_ORIGN,
    credentials: true
})) 

// express configaration
app.use(express.json({limit:"16kb"}))  //agar koi json ke form me data aayega to max 16kb tak aayega
app.use(express.urlencoded({extended:true , limit:"16kb"})) // agar url se data aata hai to wo max 16kb tak aayega
app.use(express.static("public"))  //agar koi img,file aata hai to usse hum public folder me save karenge

//cookie configaration(for save data in cookies and fetch it)

app.use(express.cookieParser)
export{ app }
