import { educational } from "../model/edu";
import { experience } from "../model/exp";
import { ProfileCompletion } from "../model/profile-completion";
import { reference } from "../model/reference";
import { PutUser } from "../model/user-type";
import { GetUserRepo } from "../user-repositery/users-get-repo";

export class GetUserService extends GetUserRepo {

    private userRepo = new GetUserRepo();

    public async getUser(id: string): Promise<{ username: string,pf:string } | null> {
        try {
            // Fetch user data using the repository
            const user = await this.userRepo.getUser(id);

            // Check if the user exists and return the username if available
            if (user) {
                return { username: user.username,pf:user.pf };
            }

            // Return null if the user does not exist
            return null;
        } catch (error) {
            console.error('Error retrieving user:', error);
            throw new Error('Failed to retrieve user');
        }
    }
    public async getProfileComplete(id: string): Promise<ProfileCompletion | null> {
        try {
            console.log("Service",id);
            
          const profile = await this.userRepo.ProfileComplete(id);
          if (!profile) {
            return null; // Return null if profile data is not found
          }
          console.log(profile);
          
          return profile; // Return the ProfileCompletion object
        } catch (error) {
          console.error("Failed to get profile completion:", error);
          throw new Error("Failed to get profile completion"); // Throw the error to be handled by the caller
        }
      }
      
      public async GetBasic(id: string): Promise<PutUser|null> {
        try {
            const basic = await this.userRepo.GetBasic(id);
            if (!basic) {
                return null;  // Return null if basic data is not found
            }
            console.log(basic);
            return basic; // Return the PutUser object
        } catch (error) {
            console.log(error);
            throw new Error("Error")
            
        }
          
      }

      public async GetExp(id: string): Promise<experience|null> {
        try {
            const exps = await this.userRepo.GetExperience(id);
            if (!exps) {
                return null;  // Return null if exps data is not found
            }
            console.log(exps);
            return exps; // Return the PutUser object
        } catch (error) {
            console.log(error);
            throw new Error("Error")
            
        }
          
      }
      
      public async GetEducation(id: string): Promise<educational|null> {
        try {
            const edu = await this.userRepo.GetEducation(id);
            if (!edu) {
                return null;  // Return null if edu data is not found
            }
            console.log(edu);
            return edu; // Return the PutUser object
        } catch (error) {
            throw new Error("Erorr")
        }
      }

      public async GetReference(id:string):Promise<reference |null>{
        try {
            const reference = await this.userRepo.GetReference(id)
            if(!reference){
                return null
            }
            return reference
        } catch (error) {
            throw new Error("Erorr")
        }
      }

}
