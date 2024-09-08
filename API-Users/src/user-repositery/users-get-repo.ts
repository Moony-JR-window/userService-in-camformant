
import { educational } from "../model/edu";
import { experience } from "../model/exp";
import { ProfileCompletion } from "../model/profile-completion";
import { reference } from "../model/reference";
import User, { Educational, Experience, Photo, Reference } from "../model/users-model";


export class GetUserRepo {

    public async getUser(id: string): Promise<{ username: string, pf: string } | null> {

        try {
            // Retrieve user data from database or API
            console.log("Repo",id);
            
            const data = await User.findById(id)
            console.log(data);
            
            // console.log(data?.username);
            const getPhoto = await Photo.findOne({ userId: id })
            if (!data) {
              return { username:"", pf: ""}
            }
            if (!getPhoto) {
              return { username: data.username, pf: ""}// Photo not found for the user in the database or API
            }
            return { username: data.username, pf: getPhoto.photo }
        } catch (error) {
            throw new Error('Failed to retrieve user data');
        }
    }

    public async GetBasic(id:string):Promise<any>{
        try {
            const data = await User.findById(id)
            if (!data) {
                return null;  // User not found in the database or API
            }
            return data
        } catch (error) {
            
        }
    }

    public async GetExperience(id:string):Promise<experience|null>{

        try {
            const data = await Experience.findOne({ userId: id })
            if (!data) {
                return null;  // Experience not found for the user in the database or API
            }
            return data
        } catch (error) {
            console.log(error);
            throw error; 
            
        }

    }

    public async GetEducation(id:string):Promise<educational|null>{
      try {
        const getEducation = await Educational.findOne({userId:id});
        if (!getEducation) {
          return null;  // Education not found for the user in the database or API
        }
        return getEducation;
      } catch (error) {
        throw  new Error("");
      }
    }

    public async GetReference(id:string):Promise<reference|null>{
      try {
        const reference= await Reference.findOne({userId:id})
        if(!reference){
          return null
        }
        return reference
      } catch (error) {
        throw new Error ("Error")
      }
    }

    public async ProfileComplete(id: string): Promise<ProfileCompletion | null> {
        try {
            console.log("Repo",id);
            
          async function basic() {
            const user = await User.findById(id);
            if (!user) {
              return 0; 
            }
      
            let phone = user.phone_number ? 1 : 0;
            let address = user.address ? 1 : 0;
            let dob = user.dob ? 1 : 0;
            let status = user.martital_status ? 1 : 0;
      
            const totalCompletion = phone + address + dob + status;
            return (totalCompletion / 4) * 100;
          }
      
          async function experience() {
            const exps= await Experience.findOne({userId:id})
            if(!exps){return 0}
            let year = exps.years_of_experience?1:0;
            let start= exps.start_date?1:0
            let end= exps.end_date?1:0
            let company= exps.company_Name?1:0
            let position = exps.position?1:0
            let description = exps.job_description?1:0
            const totalCompletion = year + company+start+end+position+description
            return (totalCompletion / 6) * (100); 
          }
      
          async function education() {
            const edus= await Educational.findOne({userId:id})
            if(!edus){return 0}
            let degree = edus.degree?1:0
            let start= edus.start_date?1:0
            let end= edus.end_date?1:0
            let major = edus.major?1:0
            let school = edus.school?1:0
            let academic = edus.academic?1:0
            const totalCompletion = degree + start+end+major+school+academic
            return (totalCompletion/6)*100 ; // Placeholder value
          }
      
          async function reference() {
            const refs = await Reference.findOne({userId:id})
            if(!refs) {return 0}
            let name = refs.name?1:0
            let phone = refs.phone_number?1:0
            let email = refs.email?1:0
            let company=refs.company?1:0
            let position = refs.position?1:0
            const totalCompletion = name + phone + email + company+position
            return (totalCompletion/5)*100
          }
      
          // Await all completion calculations
          const basicCompletion = await basic();
          const experienceCompletion = await experience();
          const educationCompletion = await education();
          const referenceCompletion = await reference();
          console.log(basicCompletion,experienceCompletion,educationCompletion,referenceCompletion);
          
          // Return the profile completion object
          return {
            basic:Math.ceil(basicCompletion) ,
            experience:Math.ceil(experienceCompletion) ,
            education:Math.ceil(educationCompletion) ,
            reference: Math.ceil(referenceCompletion),
          };
        } catch (error) {
          throw new Error('Failed to retrieve user data');
        }

    }




}