import { AdminUpdateUserAttributesCommand,SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { typeLogin, typeSigup, typeUsers, typeVerification } from "../model/user-type";
import configs from "../config";
import { UserRepo } from "../user-repositery/users-Repo";
import { awsCognito, awsCreateConfirmSigup, awsGetData, awsRole, awsSecretHast, deleteFileS3, s3Bucket, s3command } from "../AWS Service/aws";
import User, { CVs, Photo } from "../model/users-model";
import { educational } from "../model/edu";
import { experience } from "../model/exp";
import { reference } from "../model/reference";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";


export class userService {

    private userRepo = new UserRepo()
    private cognitoClient = awsCognito()


    public async postUser(user: typeSigup): Promise<any> {

        try {

            console.log(user);
            const secretHash = awsSecretHast(user.email)

            console.log(`Calculated secret hash for ${user.email}`); // Log the secret hash for debugging

            // Create the SignUpCommand with the necessary parameters
            const command = new SignUpCommand({
                ClientId: configs.clientID,
                SecretHash: secretHash,
                Username: user.email,
                Password: user.password,
                UserAttributes: [
                    { Name: "given_name", Value: ` ${user.surName} ${user.lastName}` },
                    { Name: "name", Value: `${user.surName} ${user.password}` }, // Add surName.formatted attribute
                    { Name: "zoneinfo", Value: `${user.surName} ${user.lastName} ${user.password}` }, // Add name.formatted attribute
                    { Name: "custom:role", Value: user.role },
                ]
            });
            if (command) {
                console.log(this.cognitoClient);

                const response = await this.cognitoClient.send(command);
                console.log("Cognito SignUp Response:", response)
            }


        } catch (error) {

        }
    }

    public async VerifyCode(user: typeVerification): Promise<any> {
        try {
            const secretHash = awsSecretHast(user.email)


            await this.cognitoClient.send(awsCreateConfirmSigup(user.email, user.code, secretHash));

            const getRole = awsGetData(user.email)
            const Result = await this.cognitoClient.send(getRole)
            console.log("Result is ", Result.UserAttributes);
            //============ My AWS ========================
            const addToGroupCommand = awsRole(Result, user.email)// My AWS FUNCION

            const userAttributes = Result.UserAttributes || [];
            await this.cognitoClient.send(addToGroupCommand);
            const userData: typeUsers = {
                username: userAttributes.find(attr => attr.Name === 'given_name')?.Value || '',
                email: userAttributes.find(attr => attr.Name === 'email')?.Value || '',
                role: userAttributes.find(attr => attr.Name === 'custom:role')?.Value || '',
                given_name: ""
            };

            console.log("DATA ALL is", userData);
            await this.userRepo.createUser(userData)
            console.log(this.userRepo);

        } catch (error) {

        }
    }

    public async loginUser(user: typeLogin): Promise<typeLogin|null> {

        try {
            console.log("service is ",user);
            if(!user){
                return null
            }
            if (!user || !user.email || !user.password) {
                console.log("Error not logged");
                
                throw new Error("Missing email or password");
            }
            return user
        } catch (error) {
            throw new Error("Error")
        }
    }

    public async UpdataInformation(data: typeUsers, id: string): Promise<any> {
        try {
            const updatedUser = await User.findByIdAndUpdate(id);
            console.log("Updated User is ", updatedUser);
            const getDataAll = await awsGetData(updatedUser?.email || "")
            const getDataResponse = await this.cognitoClient.send(getDataAll);
            const getData = getDataResponse?.UserAttributes?.reduce((acc: any, attr: any) => {
                acc[attr.Name] = attr.Value;
                return acc;
            }, {});

            let UpdateData = {
                username: `${data.surName ?? ''} ${data.lastName ?? ''}`,
                email: data.email,
                dob: data.dob,
                address: data.address,
                phone_number: data.phone_number,
                martital_status: data.martital_status,
            };
            
            console.log("Updated data",UpdateData);
            
            const sub = getData.sub
            console.log("Get DATA", getData.sub);

            if (!getData) {
                console.log("No User Found");
                return null;
            }
            else {
                const command = new AdminUpdateUserAttributesCommand({
                    UserPoolId: configs.userPoolID, // replace with your User Pool ID
                    Username: sub, // assuming getData contains the username from Cognito
                    UserAttributes: [
                        {
                            Name: "email",
                            Value: data.email, // Set given_name to the email value
                        },
                        {
                            Name: "email_verified",
                            Value: "true", // Set to "true" if the email is verified
                        },
                        {
                            Name: "given_name",
                            Value: data.username, // Set to "true" if the email is verified
                        }
                    ],
                });



                await this.cognitoClient.send(command);
                const user = await this.userRepo.UpdataInformation(id, UpdateData)
                console.log("Cognito given_name updated to email value");
                return user;


            }


        } catch (error) {

        }
    }


    public async Educational(
        id: string,
        data: educational,
    ): Promise<any> {
        try {
            const edu = await this.userRepo.Educational(id, data)
            return edu
        } catch (error) {

        }
    }

    public async Experience(
        id: string,
        data: experience,
    ): Promise<any> {
        try {
            console.log("experience");
            const exp = await this.userRepo.Experience(id, data)
            
            return exp
        } catch (error) {
        }
    }

    public async References(id: string, data: reference): Promise<any> {
        try {
            const references = await this.userRepo.Reference(id, data);
            return references
        } catch (error) {
        }
    }


    public async uploadCV(id: string, fileCV: Express.Multer.File): Promise<any> {
        try {
            console.log(id, fileCV);
            const nameCV = Date.now().toString() + "_" + fileCV.originalname;
            const s3 = s3command();
            const params = await s3Bucket(fileCV, nameCV);
            await s3.send(new PutObjectCommand(params));
            const fileUrl = `https://camfor.s3.amazonaws.com/${nameCV}`;
            console.log("file url", fileUrl);
            const dataCV = await CVs.findOne({ userId: id })
            if (dataCV) {
                let numberUpload = await dataCV?.cv_path.length + 1
                console.log(numberUpload);

                await this.userRepo.UploadCvFile(id, fileUrl, numberUpload)
            } else {
                await this.userRepo.UploadCvFile(id, fileUrl, 1)
            }
            return params
        } catch (error) {

        }
    }


    public async deleteCV(id: string, index: number): Promise<any | null> {
        try {
            const result = await this.userRepo.DeleteCvFile(id, index);
            console.log(result);
            // Check if the result is an object containing cvName
            if (result && typeof result === 'object' && 'cvName' in result) {
                const splitURL = result.cvName.split('/');
                const getnewName = splitURL[3];
                console.log('User file name:', getnewName);
                const s3 = s3command();
                const params = deleteFileS3(getnewName);
                await s3.send(new DeleteObjectCommand(params))
                return result.cvName;
            }

            return null;
        } catch (error) {

        }

    }

    public async UploadPhoto(
        id: string,
        filePhoto: Express.Multer.File,
    ): Promise<any | null> {
        try {
            console.log(id, filePhoto);
            const namePhoto = Date.now().toString() + "_" + filePhoto.originalname;
            const s3 = s3command();
            const params = await s3Bucket(filePhoto, namePhoto);
            await s3.send(new PutObjectCommand(params));
            const fileUrl = `https://camfor.s3.amazonaws.com/${namePhoto}`;
            console.log("file url", fileUrl);
            const dataPhoto = await Photo.findOne({ userId: id })
            if (dataPhoto) {
                let oldfile = await dataPhoto?.photo
                console.log(oldfile);
                const splitURL = oldfile.split('/');
                const getnewName = splitURL[3];
                const params = deleteFileS3(getnewName);
                await s3.send(new DeleteObjectCommand(params))
                await this.userRepo.UploadPhoto(id, fileUrl)
            } else {
                await this.userRepo.UploadPhoto(id, fileUrl)
            }
            return params
        } catch (error) {

        }

    }










}