import express from 'express';
const app = express();
import userRoutes from './routes/user.routes.js';


app.use(express.json());

app.use('/users', userRoutes);

app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})