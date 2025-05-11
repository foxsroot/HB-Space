import { AuthPayload } from "../../middlewares/authMiddleware";
import { Multer } from "multer";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload; // For authenticated user data
            file?: Multer.File; // For single file uploads
            files?: Multer.File[]; // For multiple file uploads (optional)
        }
    }
}

export { };