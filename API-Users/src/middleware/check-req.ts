import { Request, Response, NextFunction } from 'express';

export function CheckPromistion(req: Request, res: Response, next: NextFunction) {
    // Check if headers meet the required conditions
    const fieldHeader = req.headers['field'];

    if (fieldHeader === 'proxy') {
        // If req.file exists, attach it to req.body.file
        if (req.file) {
            req.body.file = req.file;
        }
        next(); // Move to the next middleware or route handler
    } else {
        // Return a 403 Forbidden response if headers don't match
        res.status(403).json({ message: 'You are not promistion ' });
    }
}
