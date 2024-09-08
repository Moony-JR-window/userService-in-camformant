import { CognitoJwtVerifier } from "aws-jwt-verify"
import configs from "../config"
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"

export function awsCognito() {
  return new CognitoIdentityProviderClient({ region: configs.region,credentials: {
      accessKeyId: configs.keyId,
      secretAccessKey: configs.keySecret
  } })
}

export function JWT_Verify(){
    const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: configs.userPoolID,
  tokenUse: "access", // or "access"
  clientId: configs.clientID,
  jwksFetchTimeout: 10000, // Increase timeout

})
return jwtVerifier
}



