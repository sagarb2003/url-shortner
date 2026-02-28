import express from 'express';
import { createShortUrl, deleteUrl, getAllUrls, redirectToTargetUrl } from '../controllers/url.controller.js';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/shorten',authenticationMiddleware,createShortUrl)
router.get('/allUrls',authenticationMiddleware,getAllUrls)
router.delete('/:id',authenticationMiddleware,deleteUrl)
router.get('/:shortCode', redirectToTargetUrl)

export default router;