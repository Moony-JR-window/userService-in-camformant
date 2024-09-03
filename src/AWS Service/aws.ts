import { AdminAddUserToGroupCommand, AdminGetUserCommand, CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import configs from "../config";
import * as crypto from "crypto";
import { S3Client } from "@aws-sdk/client-s3";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export function awsCreateConfirmSigup(email: string, code: string, secretHash: string) {

    return new ConfirmSignUpCommand({
        ClientId: configs.clientID,
        SecretHash: secretHash,
        Username: email,
        ConfirmationCode: code,
    });
}

export function s3command(){
    const s3 = new S3Client({
        region: configs.region,
        credentials: {
            accessKeyId: configs.keyId,
            secretAccessKey: configs.keySecret,
        }
    });
    return s3
}




// Set up the verifier with your User Pool ID and App Client ID
export function JWT_Verify(){
    const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: configs.userPoolID,
  tokenUse: "id", // or "access"
  clientId: configs.clientID,

})
return jwtVerifier
}


export function awsSecretHast(username:string) {
    const hash = crypto.createHmac("SHA256", configs.clientSecret)
        .update(username + configs.clientID)
        .digest("base64");
    return hash;
}

export function awsCognito() {
    return new CognitoIdentityProviderClient({ region: configs.region,credentials: {
        accessKeyId: configs.keyId,
        secretAccessKey: configs.keySecret
    } })
}


export function awsRole(Result:any|[],email: string){
    const group=Result.UserAttributes?.find((attr: { Name: string; }) => attr.Name === 'custom:role');
    return new AdminAddUserToGroupCommand({
        UserPoolId: configs.userPoolID,
        Username: email, 
        GroupName:group?.Value,
})
}



export function awsGetData( email: string) {
    return new AdminGetUserCommand({
        Username:email,
        UserPoolId:configs.userPoolID
    })
}

export function deleteFileS3(nameFile:string){
    const params = {
        Bucket: 'camfor', // Replace with your bucket name
        Key: nameFile
    };
    return params
}

export function s3Bucket (file:Express.Multer.File,fileName:string ){
    const params = {
        Bucket: "camfor",
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype // Use the actual MIME type
    };
    return params
}