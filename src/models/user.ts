// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
export const userVerifyEnum: string[] = ["phone", "email"];
export const userRoleEnum: string[] = ["owner", "admin", "user"];

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    first_name: { type: String, required: true, trim: true, minlength: 3, maxlength: 40 },
    last_name: { type: String, required: true, trim: true, minlength: 3, maxlength: 40 },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user", enum: userRoleEnum },
    verify: { type: [String], enum: userVerifyEnum },
    profile_photo: {
        type: String, default: "/profile-photo/profile-photo.png",
        set: (p: string): string => p.replace(/\\/g, "/").replace(/(^public)(\/.*)/g, "$2")
    },
    birth_date: {
        type: Date,
        set: (v: number): Date => (new Date(Date.now() - (v * 1000 * 3600 * 24 * 365))),
        get: (v: Date): number => Math.floor((Date.now() - new Date(v).getTime()) / 1000 / 3600 / 24 / 365)
    },
    country: String,
    description: String
});
// added crerate & update time in document
userSchema.plugin(timeStamp);

const User = mongoose.model("User", userSchema);
export default User;