import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getAllApplicationEntries, processApplication } from '../controllers/matcher.controller';
import { singleUpload } from '../middleware/multer.middleware';

const matcherRouter = Router();

matcherRouter.post("/process-application", authMiddleware, singleUpload.single("resume"),  processApplication);
matcherRouter.get("/get-all-entries", authMiddleware, getAllApplicationEntries);

export default matcherRouter;