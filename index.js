import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express();
const PORT = 8000
const mongoDB_URI = "mongodb://127.0.0.1:27017/todoDB"

app.use(express.json());
app.use(cors())

mongoose
.connect(mongoDB_URI)
.then(()=>console.log("Mongodb Connected"))
.catch((err)=>console.error("MongoDB connection error",err))



const todoSchema = new mongoose.Schema({
    title:String,
    completed:Boolean
})


const Todo = mongoose.model("Todo",todoSchema)


app.post("/todos",async(req,res)=>{
try {const{title,completed} = req.body;
const newTodo = new Todo({title,completed})
await newTodo.save();
res.status(201).json(newTodo)
    } catch (error) {
        res.status(500).json({message:"Error saving Todo",error});
    
}
})

app.get("/todos",async(req,res)=>{
    const todos = await Todo.find()
    res.json(todos)
})

app.put("/todos/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const updates = req.body
        const updatedTodo = await Todo.findByIdAndUpdate(id,updates,{new:true})
        if(!updatedTodo)
            return res.status(404).json({message:"Todo not found"});
        res.json(updatedTodo)
    } catch (error) {
         res.status(500).json({message:"Error udpating Todo :",error});
        
    }
})


app.delete("/todos/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const deleteTodo = await Todo.findByIdAndDelete(id)
        if(!deleteTodo)
            return res.status(404).json({message:"Todo not found"})
        res.json("Todo deleted successfully")
    } catch (error) {
        res.status(500).json({message:"Error deleting todo"})
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})