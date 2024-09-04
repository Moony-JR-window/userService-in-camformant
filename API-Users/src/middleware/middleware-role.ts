// roleService.ts
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import configs from "../config";
const cognitoClient = new CognitoIdentityProviderClient({ region: configs.region });

export async function getUserRole(username: string) {
    const command = new AdminGetUserCommand({
        UserPoolId: configs.clientID,
        Username: username,
    });
    const user = await cognitoClient.send(command);
    const roleAttr = user.UserAttributes?.find(attr => attr.Name === 'custom:role');
    console.log(roleAttr?.Value);
    return roleAttr?.Value;
}
