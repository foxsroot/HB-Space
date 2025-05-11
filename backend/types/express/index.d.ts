import { AuthPayload } from "../../middlewares/authMiddleware";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export { };