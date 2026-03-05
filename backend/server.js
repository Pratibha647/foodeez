const express=require("express");
const app=express();
const cors=require("cors");
const dotenv=require("dotenv").config();
const PORT=process.env.PORT || 3000;
const connectDB=require("./config/connectionDB");
connectDB();

app.use(cors());
app.use(express.json());

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"))

app.listen(PORT,(err)=>{
    console.log(`app is listening on ${PORT}`);
});