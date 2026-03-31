import express from "express"
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'

const allowedOrigins = [
  "http://localhost:3000",
  "https://task-manager-frontend-th9q.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }))
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

import userRouter from "./routes/user.route.js"

app.use("/api", userRouter)