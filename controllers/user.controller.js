import { eq } from "drizzle-orm";
import db from "../db/index.js";
import {usersTable} from "../models/index.js";
import { loginPostRequestBodySchema, signupPostRequestBodySchema } from "../validations/request.validation.js";
import { hashPassword } from "../utils/hash.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export async function createUser(req, res) {
    const validationData = await signupPostRequestBodySchema.safeParseAsync(req.body);
    if (validationData.error) {
        return res.status(400).json({ error: validationData.error.format() });
    }
    const { firstName, lastName, email, password } = validationData.data;
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "User with this email already exists" });
    }
    const { salt, hashedPassword } = hashPassword(password);
    const [user] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt
    }).returning({ userId: usersTable.id });
    res.status(201).json({ message: "User created successfully", userId: user.userId });
}

export async function loginUser(req, res) {
    const validationData = await loginPostRequestBodySchema.safeParseAsync(req.body);
    if (validationData.error) {
        return res.status(400).json({ error: validationData.error.format() });
    }
    const { email, password } = validationData.data;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
        return res.status(400).json({ message: `User with email ${email} does not exist` });
    }
    const { salt, password: storedHashedPassword } = user;
    const { hashedPassword } = hashPassword(password, salt);
    if (hashedPassword !== storedHashedPassword) {
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET)
    res.status(200).json({ token: token });
}