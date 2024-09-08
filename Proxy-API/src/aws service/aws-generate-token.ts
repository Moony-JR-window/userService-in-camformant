import { AuthFlowType, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import configs from '../config';
import { awsCognito} from './aws';


const client = awsCognito()

async function refreshToken(refreshToken:any): Promise<{ accessToken: string; idToken: string; expiresIn: number }|null> {
    try {

        const paramsNew = {
            AuthFlow: 'REFRESH_TOKEN_AUTH' as AuthFlowType ,
            ClientId: configs.clientID,
            UserPoolId: configs.userPoolID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: configs.clientSecret, 
            },
        };
        if(!paramsNew){
            return null;
        }

        const command = new InitiateAuthCommand(paramsNew); 
        const response = await client.send(command);
        
        if(!response.AuthenticationResult){
            return null
        }
            const { AccessToken, IdToken, ExpiresIn } = response.AuthenticationResult;
            return {
                accessToken: AccessToken!,
                idToken: IdToken!,
                expiresIn: ExpiresIn!,
            };

    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

export default refreshToken;