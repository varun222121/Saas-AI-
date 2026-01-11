import express from 'express'
import { generateArticles, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from '../controllers/aiController.js';
import { testGenerateArticle, testGenerateImage } from '../controllers/testController.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

// TEST ENDPOINTS - No auth required (REMOVE IN PRODUCTION!)
aiRouter.post('/test-generate-article', testGenerateArticle);
aiRouter.post('/test-generate-image', testGenerateImage);

// Production endpoints with auth
aiRouter.post('/generate-article', auth, generateArticles);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-image-background', upload.single('image'), auth , removeImageBackground);

aiRouter.post('/remove-image-object', upload.single('image'), auth , removeImageObject);
aiRouter.post('/resume-review', upload.single('resume'), auth , resumeReview);
export default aiRouter