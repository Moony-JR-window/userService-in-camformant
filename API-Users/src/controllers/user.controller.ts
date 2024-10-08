import { Controller, Route, Get, Post, Body, Put, Patch, UploadedFile, Delete, Query,Request } from 'tsoa';
import { typeLogin, typeSigup, typeUsers, typeVerification } from '../model/user-type';
import { userService } from '../user-service/user-service';
import { educational } from '../model/edu';
import { experience } from '../model/exp';
import { reference } from '../model/reference';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import configs from '../config';
import { awsCognito, awsSecretHast} from '../AWS Service/aws';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';






// https://v1/user/auth/callback

@Route("/v1/user")
export class UserController extends Controller {
    private user = new userService()
    @Get("/hello/jest")
    public helloJest(): string {
        return "Hello Docker demo! Hello 1111";
    }
    @Post('/')
    public async postUser(
        @Body() user: typeSigup
    ): Promise<any> {
        try {
            const postUser = await this.user.postUser(user);
            return postUser;
        } catch (err) {

        }
    }
    @Post('/verify')
    public async verifyUser(
        @Body() user: typeVerification,
    ): Promise<any> {
        try {
            console.log(user);
            const verifyUser = await this.user.VerifyCode(user);
            return verifyUser;
        } catch (error) {

        }
    }

    @Post('/login')
    public async loginUser(
        @Body() data: typeLogin,
        @Request() request: ExpressRequest
    ): Promise<{idUser:any}|null> {
        try {
            const user= await this.user.loginUser(data)
            // Extract the response object from the request
            console.log(user);
            if(!user?.idUser){
                console.log("Error not logged");
            }
            console.log("ID user controller",user?.idUser);
            

            if(!user){ return null;}
            const response = request.res as ExpressResponse;
            const secret= awsSecretHast(data.email)
            const command = new InitiateAuthCommand({
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: configs.clientID,
                AuthParameters: {
                    USERNAME: data.email,
                    PASSWORD: data.password,
                    SECRET_HASH: secret
                }
            });
            const s3=awsCognito()

            const authResponse = await s3.send(command);

            if (!authResponse.AuthenticationResult) {
                return null
            }

            // Extract tokens
            const { IdToken, AccessToken, RefreshToken } = authResponse.AuthenticationResult;

            // Set tokens as HTTP-only cookies
            response.cookie('id_token', IdToken, { httpOnly: true, secure: true, sameSite:'none' });
            response.cookie('access_token', AccessToken, { httpOnly: true, secure: true,sameSite:'none' });
            response.cookie('refresh_token', RefreshToken, { httpOnly: true, secure: true,sameSite:'none' });

            response.cookie('user_id', user.idUser.toString(), { httpOnly: true, secure: true,sameSite:'none'  });
            return user

        } catch (err) {
            console.log("Catching Error: ");
            
            throw new Error("Error")

        }
    }

    @Put('/{id}')
    public async UpdataInformation(
        @Body() data: typeUsers,
        @Patch('id') id: string,
    ):Promise<typeUsers|null> {
        try {
        //     const update = {
        //     surName: data.surName,
        //     lastName: data.lastName,
        //     username: data.username,
        //     email: data.email,
        //     phone_number: data.phone_number,
        //     martital_status:data.martital_status,
        // };
            const updateUser = await this.user.UpdataInformation(data,id);
            return updateUser;
        } catch (error) {
            console.error('Error retrieving profile completion:', error);
            throw new Error('Failed to retrieve profile completion');
            
        }
    }


    @Put('/education/{id}')
    public async Educational(
        @Body() data: educational,
        @Patch('id') id: string,
    ): Promise<any>{
        try {
            const updateEdu = await this.user.Educational(id,data);
            return updateEdu;
        } catch (error) {
            
        }
    }
    @Put('/experince/{id}')
    public async Experience(
        @Body() data: experience,
        @Patch('id') id: string,
    ): Promise<experience|null>{
        try {
            const updateExp = await this.user.Experience(id,data);
            if(!updateExp){
                return null
            }
            return updateExp;
        } catch (error) {
            throw new Error("Error")
            
        }

    }
    @Put('/reference/{id}')
    public async Reference(
        @Body() data: reference,
        @Patch('id') id: string,
    ): Promise<reference|null>{
        try {
            const reference = await this.user.References(id,data)
            console.log(reference);
            
            return reference
        } catch (error) {
            throw new Error("error")
        }
    }

    @Put('/cv/{id}')
    public async UpdateCv(
        @UploadedFile() file_path: Express.Multer.File,
        @Patch('id') id: string,
    ): Promise<any>{
        try {
            const updateCv = await this.user.uploadCV(id,file_path)
            return updateCv
        } catch (error) {
            
        }
    }

    @Delete('/cv/{id}/{index}')
    public async DeleteCv(
        @Patch('id') id: string,
        @Query('index') index:number
    ): Promise<any | null>{
        try {
            const deleteCv = await this.user.deleteCV(id,index)
            return deleteCv
        } catch (error) {
            
        }
    }

    @Post('/photo/{id}')
    public async UpdatePhoto(
        @UploadedFile() photo: Express.Multer.File,
        @Patch('id') id: string,
        
    ): Promise<any>{
        try {
            const file_path=await this.user.UploadPhoto(id,photo)
            return file_path
        } catch (error) {
            
        }

    }
}
