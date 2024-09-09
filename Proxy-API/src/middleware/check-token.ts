import { Request, Response, NextFunction } from 'express';
import { JWT_Verify } from '../aws service/aws';
import refreshToken from './refresh-token';

async function checkToken(req: Request, res: Response, next: NextFunction) {
    const AccessToken = req.cookies['access_token'];
    const idUser = req.cookies['user_id']; // Assume this is the user ID token
    const refresh_token = req.cookies['refresh_token']; // Assume this is the user ID token

    console.log('Access token from cookies:', AccessToken);

    if (AccessToken) {
        try {
            console.log("Verifying ID token...");
            await JWT_Verify().verify(AccessToken);
            console.log("Token verified successfully:");
            req.clientId = idUser;
            next();
        } catch (error) {
            console.log("Verification failed");
            const refresh = await refreshToken(refresh_token)
            if (refresh) {
                res.cookie('id_token', refresh.idToken, { httpOnly: true, secure: false,sameSite:'none' });
                res.cookie('access_token', refresh.accessToken, { httpOnly: true, secure: false,sameSite:'none' });
                req.clientId = idUser;
                console.log(idUser);
                
                console.log("Work at Auto Refresh token expired",refresh.expiresIn);
            }
            next()
            
        }
    } else {
        console.log("No access token found in cookies");
        res.status(401).send('Unauthorized');
        return;

    }
}

export default checkToken;
