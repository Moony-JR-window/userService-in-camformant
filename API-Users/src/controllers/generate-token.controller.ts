import { Controller, Get, Route, Request, Tags } from "tsoa";
import { Request as ExpressRequest, Response as ExpressResponse  } from 'express';
import refreshToken from "../AWS Service/aws-auth";

@Route('/generate')
@Tags('generate token')
export class GenerateToken extends Controller {
    @Get('/token')
    public async generateToken(
        @Request() request: ExpressRequest
    ): Promise<any> {

        try {
            // Access the response (though not necessary for cookie retrieval)
            const response = request.res as ExpressResponse;

            // Retrieve the refresh token from cookies in the request
            const refreshTokenCookie = request.cookies['refresh_token'];

            if (!refreshTokenCookie) {
                return { message: "Refresh token not found in cookies" };
            }

            // Call the refreshToken function and await the result
            const newTokens = await refreshToken(refreshTokenCookie);
            console.log("New Token",newTokens);
            
            // Return the new tokens or a success message
            if (newTokens) {
                response.cookie('id_token', newTokens.idToken, { httpOnly: true, secure: true });
                response.cookie('access_token', newTokens.accessToken, { httpOnly: true, secure: true });
                return { 
                    accessToken: newTokens.accessToken, 
                    idToken: newTokens.idToken, 
                    expiresIn: newTokens.expiresIn 
                };

            } else {
                return { message: "Failed to refresh token" };
            }
        } catch (error) {
            console.error('Error generating token:', error);
            throw new Error("Error generating token");
        }
    }
}
