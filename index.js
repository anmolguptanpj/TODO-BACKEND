import express from "express"
import mongoose from "mongoose"
import cors from "cors"
const app = express()
const PORT = 8000
const MONGODB_URI="mongodb://127.0.0.1:27017/todoDB"

app.use(express.json())
app.use(cors())

mongoose.
connect(MONGODB_URI)
.then(()=>console.log("Mongo db connected"))
.catch((err)=>console.error("MongoDB connection error",err));

const todoSchema = new mongoose.Schema({
    title:String,
    completed:Boolean
});

const Todo = mongoose.model("Todo",todoSchema)

app.post("/todos",async(req,res)=>{
    try {
        const{title,completed} = req.body;
        const newTodo = new Todo({title,completed})
        await newTodo.save();
        res.status(201).json(newTodo)
        
    } catch (error) {
        res.status(500).json({message:"Error saving Todo",error});
        
    }
})

app.get("/todos",async(req,res)=>{
    const todos = await Todo.find()
    res.json(todos);
})




app.listen(8000,()=>{console.log(`server is running on PORT ${PORT}`)})