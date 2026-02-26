import { eq } from "drizzle-orm";
import db from "../db";
import userTable from "../db/schema/user.schema";
import { loginPostRequestBodySchema, signupPostRequestBodySchema } from "../validations/request.validation";
import { hashPassword } from "../utils/hash";
import { jwt } from 'jsonwebtoken';

export async function createUser(req, res) {
    const validationData = await signupPostRequestBodySchema.safeParseAsync(req.body);
    if (validationData.error) {
        return res.status(400).json({ error: validationData.error.format() });
    }
    const { firstName, lastName, email, password } = validationData.data;
    const existingUser = await db.select().from(userTable).where(eq(userTable.email, email));
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }
    const { salt, hashedPassword } = hashPassword(password);
    const [user] = await db.insert(userTable).values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt
    }).returning({ userId: userTable.id });
    res.status(201).json({ message: "User created successfully", userId: user.userId });
}

export async function loginUser(req, res) {
    const validationData = await loginPostRequestBodySchema.safeParseAsync(req.body);
    if (validationData.error) {
        return res.status(400).json({ error: validationData.error.format() });
    }
    const { email, password } = validationData.data;
    const [user] = await db.select().from(userTable).where(eq(userTable.email, email));
    if (!user) {
        return res.status(400).json({ message: `User with email ${email} does not exist` });
    }
    const { salt, password: storedHashedPassword } = user;
    const { hashedPassword } = hashPassword(password, salt);
    if (hashedPassword !== storedHashedPassword) {
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    res.status(200).json({ token: token });
}