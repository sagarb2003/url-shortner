import { createShortUrlPostRequestBodySchema } from "../validations/request.validation.js";
import db from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";

export async function createShortUrl(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const validationData = await createShortUrlPostRequestBodySchema.safeParseAsync(req.body);
    if (validationData.error) {
        return res.status(400).json({ error: validationData.error.format() });
    }
    const result = await db.insert(urlsTable).values({
        shortCode: nanoid(8),
        targetUrl: validationData.data.targetUrl,
        userId
    })
    res.status(201).json({ message: "Short URL created successfully" });
}