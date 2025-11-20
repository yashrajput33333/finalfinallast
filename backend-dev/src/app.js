import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(
  cors({
    origin: "http://localhost:8080", 
    credentials: true,
  })
);


//initially we had to use body parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))
app.use(cookieParser());


// for files we use third party package multer
// when I have data from url then all use it
// routes import
app.get("/",(req,res)=>{
   res.send("hello world")
})
import userRouter from "./routes/user.route.js"
import middlewareWrapper from "cors"

import patientRoutes from "./routes/patient.route.js"
import providerRoutes from "./routes/provider.route.js"
import goalRoutes from "./routes/goal.route.js"
import publicRoutes from "./routes/public.route.js"
//routes declaration
//now we need middlewareWrapper
app.use('/api/auth', userRouter);
app.use('/api/patient', patientRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/public', publicRoutes);

// http://localhost:8000/users/register
export {app}