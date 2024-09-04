import { Request, Response, NextFunction } from 'express';


declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}
export function userIdMiddleware(req: Request, res: Response, next: NextFunction) {
    const userId = req.cookies['user_id'];

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID not found in cookies' });
    }

    // Optionally, you can perform validation or fetch user details based on userId here
    // For example, attaching the userId to the request object
    req.userId = userId;

    // Continue to the next middleware or route handler
    next();
}
