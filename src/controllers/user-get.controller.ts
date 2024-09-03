import { Controller, Get, Route, Tags, Patch } from "tsoa";
import { GetUserService } from "../user-service/user-get-service";
import { ProfileCompletion } from "../model/profile-completion";
import { PutUser } from "../model/user-type";
import { experience } from "../model/exp";
import { educational } from "../model/edu";
import { reference } from "../model/reference";

@Route("/v1/user")
@Tags("GetUser")
export class UserGetController extends Controller {

    private userService = new GetUserService();

    @Get("/{id}")
    public async getUser(
        @Patch("id") id: string
    ): Promise<{ username: string, pf: string } | null> {
        try {
            const user = await this.userService.getUser(id);
            console.log("Controler", user);

            if (user) {
                return { username: user.username, pf: user.pf };
            }
            return null;
        } catch (error) {
            console.error('Error retrieving user:', error);
            throw new Error('Failed to retrieve user');
        }
    }


    @Get('/pfComplete/{id}')
    public async getProfileComplete(
        @Patch("id") id: string
    ): Promise<ProfileCompletion | null> {
        try {
            const data = await this.userService.getProfileComplete(id)
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            console.error('Error retrieving profile completion:', error);
            throw new Error('Failed to retrieve profile completion');
        }
    }
    @Get('/bacis/{id}')
    public async GetBasic(
        @Patch("id") id: string
    ): Promise<PutUser | null> {
        try {
            const data = await this.userService.GetBasic(id)
            if (!data) {
                return null
            }
            return data
        } catch (error) {
            console.error('Error retrieving profile completion:', error);
            throw new Error('Failed to retrieve profile completion');
        }
    }

    @Get('/experince/{id}')
    public async GetExp(
        @Patch("id") id: string
    ): Promise<experience | null> {
        try {
            const data = await this.userService.GetExp(id)

            if (!data) {
                return null
            }
            return data


        } catch (error) {
            throw new Error("Eorr")
        }
    }
    
    @Get('/education/{id}')
    public async GetEducation(
        @Patch("id") id: string
    ): Promise<educational | null> {
        try {
            const education= await this.userService.GetEducation(id)
            if (!education) {
                return null
            }
            return education
        } catch (error) {
            throw new Error("Error")
        }
    }

    @Get('/reference/{id}')
    public async GetReference(
        @Patch("id") id: string
    ): Promise<reference | null> {
        try {
            const reference = await this.userService.GetReference(id)
            if(!reference){
                return null
            }
            return reference
        } catch (error) {
            throw new Error("Error")
        }
    }

    @Get('/cv/{id}')
    public async GetCvs():Promise<any>{
        try {
            
        } catch (error) {
            
        }
    }


}
