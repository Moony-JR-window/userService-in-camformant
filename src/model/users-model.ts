import mongoose, { Schema, Model } from "mongoose";
import { typeUsers } from "./user-type";
import { educational } from "./edu";
import { experience } from "./exp";
import { reference } from "./reference";
import { apply } from "./apply";
import { status } from "./status";
import { Cv } from "./upload-cv";
import { typePhoto } from "./upload-photo";
import { ProfileCompletion } from "./profile-completion";

const ExperienceSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
  years_of_experience: { type: String, required: false },
  start_date: { type: String, required: false },
  end_date: { type: String, required: false },
  job_description: { type: String, required: false },
  company_Name: { type: String, required: false },
  position: { type: String, required: false },

});

const EducationalSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Users' },
  school: { type: String, require: false },
  degree: { type: String, required: false },
  start_date: { type: String, required: false },
  end_date: { type: String, required: false },
  major: { type: String, required: false },
  academic: { type: String, required: false }
});



const UserSchema: Schema = new Schema({
  username: { type: String, required: false, },
  email: { type: String, required: false, unique: false },
  phone_number: { type: String, required: false, unique: false },
  dob: { type: String, required: false },
  address: { type: String, required: false },
  martital_status: { type: String, required: false },
  role: { type: String, required: true },
  education: { type: mongoose.Schema.Types.ObjectId, required: false },
  experience: { type: mongoose.Schema.Types.ObjectId, required: false },
  apply: { type: mongoose.Schema.Types.ObjectId, required: false }

});

const ApplySchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: false },
  status: { type: String, required: false },
  cv: { type: String, required: false },
  result: { type: String, required: false },

})

const ReferenceSchema: Schema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  phone_number: { type: String, required: false },
  company: { type: String, required: false },
  position: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
})

const StatusSchema: Schema = new Schema({
  apply_id: { type: mongoose.Schema.Types.ObjectId, ref: 'apply', required: false },
  status_date: { type: String, required: false }
})

const CvSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  cv_path: { type: [String], required: false },
  number: { type: Number, required: false },
  updatedAt: { type: Date, default: Date.now }
})

const PhotoSchema :Schema =new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  photo: { type: String, required: false },
  updatedAt: { type: Date, default: Date.now }
  
})
const ProfileComple:Schema=new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  basic: { type: Number, required: false },
  education: { type: Number, required: false},
  experience: { type: Number, required: false},
  references: { type:Number,required:false}
})

export const Pfcompletion :Model<ProfileCompletion>=mongoose.model<ProfileCompletion>('Profilecompletion',ProfileComple)

export const Photo: Model<typePhoto> = mongoose.model<typePhoto>('photos', PhotoSchema)

export const CVs: Model<Cv> = mongoose.model<Cv>('cvs', CvSchema)

export const Status: Model<status> = mongoose.model<status>('status', StatusSchema)

export const Apply: Model<apply> = mongoose.model<apply>('apply', ApplySchema)

export const Reference: Model<reference> = mongoose.model<reference>('reference', ReferenceSchema)

export const Experience: Model<experience> = mongoose.model<experience>('exp', ExperienceSchema)

export const Educational: Model<educational> = mongoose.model<educational>('Edu', EducationalSchema)

const User: Model<typeUsers> = mongoose.model<typeUsers>('Users', UserSchema);

export default User;

