import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import morgan from "morgan"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { posts, users } from "./data/index.js"
import { verifyToken } from "./middleware/auth.js"
import Post from "./models/Post.js"
import User from "./models/User.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/posts.js"
import postsRoutes from "./routes/users.js"

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url) //Did this because we define type: module in package.json
const __dirname = path.dirname(__filename)

dotenv.config() //Invoking dotenv, which allows us to use .env files
const app = express() //Invoke express application. This allows us to use the middlewars on top of app.
app.use(express.json())
app.use(helmet()) //helps set up http secure http headers for express app
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })) //allow cross-origin requests
app.use(morgan("common")) //Used to log the requests coming to the server.
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))
//Establishes the dir where our assets will be stored. Right now we can store it locally but later we can place it in a S3 storage on cloud.

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets")
  },
  filename: function (req, res, cb) {
    cb(null, file.orignalName)
  },
})

const upload = multer({ storage })

/*ROUTES WITH FILES*/
app.post("./auth/register", upload.single("picture", register))
app.post("./posts", verifyToken, upload.single("picture", createPost))

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/users", usersRoutes)
app.use("/posts", postsRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose.set("strictQuery", false)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

    /* ADD DATA ONE TIME */
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((error) => console.log(`${error} did not connect`))
