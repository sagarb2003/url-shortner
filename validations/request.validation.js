import {z} from 'zod';

export const signupPostRequestBodySchema=z.object({
    firstName:z.string().min(1,{message:"First name is required"}),
    lastName:z.string().optional(),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(3,{message:"Password must be at least 3 characters long"})
})

export const loginPostRequestBodySchema=z.object({
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(3,{message:"Password must be at least 3 characters long"})
})