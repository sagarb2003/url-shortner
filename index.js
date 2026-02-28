import express from 'express';
const app = express();
import userRoutes from './routes/user.routes.js';
import urlRoutes from './routes/url.route.js';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import { url } from 'zod';


app.use(express.json());

app.use(urlRoutes)
app.use('/users', userRoutes);

app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})