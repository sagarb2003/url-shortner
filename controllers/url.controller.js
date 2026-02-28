import { createShortUrlPostRequestBodySchema } from "../validations/request.validation.js";
import db from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

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
    return res.status(201).json({ message: "Short URL created successfully" });
}

export async function redirectToTargetUrl(req, res) {
    const { shortCode } = req.params;
    const [urlRecord] = await db.select().from(urlsTable).where(eq(urlsTable.shortCode, shortCode));
    if (!urlRecord) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.redirect(urlRecord.targetUrl);
}

export async function getAllUrls(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const urls = await db.select().from(urlsTable).where(eq(urlsTable.userId, userId));
    if(!urls){
        return res.status(404).json({ error: "No URLs found for this user" });
    }
    return res.status(200).json({ urls });
}

export async function deleteUrl(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const { id } = req.params;
    const deleteCount = await db.delete(urlsTable).where(eq(urlsTable.id, id), eq(urlsTable.userId, userId));
    if(!deleteCount){
        return res.status(404).json({ error: "URL not found or user not authorized to delete this URL" });
    }
    return res.status(200).json({ message: "URL deleted successfully" });
}