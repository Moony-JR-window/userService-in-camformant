// src/services/userService.ts


import { educational } from "../model/edu";
import { experience } from "../model/exp";
import { reference } from "../model/reference";
import { PutUser, typeLogin, typeUsers } from "../model/user-type";
import User, { CVs, Educational, Experience, Photo, Reference } from "../model/users-model";


export class UserRepo {

    async createUser(userCreationParams: typeUsers): Promise<any> {
        console.log("Repo", userCreationParams);;
        const newUser = new User({ ...userCreationParams });
        console.log("Successfully");

        return newUser.save();
    }

    public async UpdataInformation(id: string, data: PutUser): Promise<any> {
        try {
            console.log("ID REPO",id);
            
            console.log("Updating user with ID:", "Data:", data);
            if(!data){
                return null
            }
            const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true });
            return updatedUser;

        } catch (error) {

        }
    }
    public async Educational(id: string, data: educational): Promise<any> {
        try {
            console.log("User ID:", id, "Educational Data:", data);

            // Find an existing educational record associated with the user
            const userEducation = await Educational.findOne({ userId: id });

            if (!userEducation) {
                // If no educational record exists, create a new one
                const newEducation = new Educational({
                    userId: id,
                    ...data
                });
                console.log("Creating new educational record:", newEducation);

                // Save the new educational record
                const savedEducation = await newEducation.save();
                console.log("SAVE ID ", savedEducation);

                // Add the educational record's ObjectId to the user's document
                const add_field = await User.findByIdAndUpdate(id, { $push: { education: savedEducation._id } });
                console.log("add new field", add_field);

                return savedEducation;
            } else {
                // If the educational record exists, update it
                const updatedEducation = await Educational.findByIdAndUpdate(
                    userEducation._id,
                    { $set: data },
                    { new: true }
                );

                console.log("Updating existing educational record:", updatedEducation);
                return updatedEducation;
            }
        } catch (error) {
            console.error("Error in Educational method:", error);
            throw error; // Re-throw the error for higher-level handling
        }
    }


    public async LoginUser(user:typeLogin):Promise<{idUser: any}|null> {

        try {
            if(!user) {
                return null
            }
            const userData = await User.findOne({email:user.email})
            if (!userData) {
                return null
            }
            if(!userData._id){
                return null
            }

            return { idUser: userData._id }
        } catch (error) {
            throw new Error("Error")
        }

    }


    public async Experience(id: string, data: experience): Promise<any> {
        try {
            console.log("User ID:", id, "Experience Data:", data);

            // Find an existing experience record associated with the user
            const userExperience = await Experience.findOne({ userId: id });

            if (!userExperience) {
                // If no experience record exists, create a new one
                const newExperience = new Experience({
                    userId: id,
                    ...data
                });
                console.log("Creating new experience record:", newExperience);

                // Save the new experience record
                const savedExperience = await newExperience.save();
                console.log("SAVE ID ", savedExperience);

                // Add the experience record's ObjectId to the user's document
                const add_field = await User.findByIdAndUpdate(id, { $push: { experience: savedExperience._id } });
                console.log("Add new field", add_field);

                return savedExperience;
            }
                // If the experience record exists, update it
                const updatedExperience = await Experience.findByIdAndUpdate(
                    userExperience._id,
                    { $set: data },
                    { new: true }
                );

                console.log("Updating existing experience record:", updatedExperience);
                return updatedExperience;
            
        } catch (error) {
            console.error("Error in Experience method:", error);
            throw error; // Re-throw the error for higher-level handling
        }
    }



    public async Reference(id: string, data: reference): Promise<any> {
        try {
            console.log("User ID:", id, "Experience Data:", data);

            // Find an existing experience record associated with the user
            const userReference = await Reference.findOne({ userId: id });

            if (!userReference) {
                // If no experience record exists, create a new one
                const newReference = new Reference({
                    userId: id,
                    ...data
                });
                console.log("Creating new experience record:", newReference);

                // Save the new experience record
                const saveReference = await newReference.save();
                console.log("SAVE ID ", saveReference);

                // Add the experience record's ObjectId to the user's document
                const add_field = await User.findByIdAndUpdate(id, { $push: { reference: saveReference._id } });
                console.log("Add new field", add_field);

                return saveReference;
            } 
                // If the experience record exists, update it
                const updateReference = await Reference.findByIdAndUpdate(
                    userReference._id,
                    { $set: data },
                    { new: true }
                );

                console.log("Updating existing experience record:", updateReference);
                return updateReference;
            
        } catch (error) {
            console.error("Error in Experience method:", error);
            throw error; // Re-throw the error for higher-level handling
        }
    }

    public async UploadCvFile(id: string, cv_path: string, number: number): Promise<any> {
        try {
            const userUploadCV = await CVs.findOne({ userId: id });
            if (!userUploadCV) {
                const fileCv = new CVs({
                    userId: id,
                    cv_path:[cv_path],
                    number
                });
                const saveCVs = await fileCv.save();
                const add_field = await User.findByIdAndUpdate(id, { $push: { cvs: saveCVs._id } });
                console.log("Add new field", add_field);
                return saveCVs;
            }else {
                const updatedCV = await CVs.findByIdAndUpdate(
                    userUploadCV._id,
                    { 
                        $push: { cv_path: cv_path }, 
                        number 
                    },
                    { new: true } 
                );
    
                console.log('Updated CV with new path:', userUploadCV.cv_path);
                return updatedCV;
            }

        } catch (error) {

        }
    }

    public async DeleteCvFile(id: string, index: number): Promise<{ cvName: string }| string | null> {
        try {
            // Find the document by userId
            const document:any = await CVs.findOne({ userId: id });
    
            if (document && document.cv_path.length >index) {
                // Remove the CV path at the specified index
                const [cvName] = document.cv_path.splice(index, 1);
                document.number = document.cv_path.length;
                console.log(document.number);
                
                await document.save();
                return { cvName };
            } else {
                return `CV path at index ${index} not found or invalid index.`;
            }
        } catch (error) {
            console.error('Error deleting CV file:', error);
            throw new Error('Failed to delete CV file.');
        }
    }

    public async UploadPhoto(id: string,photo:string): Promise<any|null> {

        try {
            const UploadPhoto = await Photo.findOne({ userId: id });
            if (!UploadPhoto) {
                const Photofile = new Photo({
                    userId: id,
                    photo,
                });
                const savePhoto = await Photofile.save();
                const add_field = await User.findByIdAndUpdate(id, { $push: { Photo: savePhoto._id } });
                console.log("Add new field", add_field);
                return savePhoto;
            }
                const saving=await Photo.findOneAndUpdate({ userId: id ,photo})
                await saving?.save();

        } catch (error) {
            
        }



    }
    

}
