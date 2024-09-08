import { AuthFlowType, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import configs from '../config';
import { awsCognito} from './aws';

// Initialize Cognito client
const client = awsCognito()
// Function to refresh token using a refresh token
async function refreshToken(refreshToken:any): Promise<{ accessToken: string; idToken: string; expiresIn: number }|null> {
    try {
        // const secretHash= awsSecretHast(refreshToken)
        // Parameters for the refresh token request
        const paramsNew = {
            AuthFlow: 'REFRESH_TOKEN_AUTH' as AuthFlowType , // Flow used for refreshing tokens
            ClientId: configs.clientID,
            UserPoolId: configs.userPoolID, // Remove this property
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: configs.clientSecret, // Provide the refresh token
            },
        };
        if(!paramsNew){
            return null;
        }

        // Initiate the refresh token request
        const command = new InitiateAuthCommand(paramsNew); // Pass UserPoolId as a separate parameter
        const response = await client.send(command);

        // Extract and return the new access and ID tokens
        if (response.AuthenticationResult) {
            const { AccessToken, IdToken, ExpiresIn } = response.AuthenticationResult;
            return {
                accessToken: AccessToken!,
                idToken: IdToken!,
                expiresIn: ExpiresIn!,
            };
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

export default refreshToken;