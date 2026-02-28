import express from 'express';
import { createShortUrl } from '../controllers/url.controller.js';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/shorten',authenticationMiddleware,createShortUrl)

export default router;