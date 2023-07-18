// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
export const sessionIssueEnum: string[] | [] = ["register", "login", "loguot", "visit", "set-content", "get-content"];

const sessionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expire_session: { type: Date, required: true },
    issue: { type: [String], enum: sessionIssueEnum, default: ["visit"] },
    is_login: { type: Boolean, default: false },
    device: String,
    ip: String,
    content: { type: String, default: "{}" }
});
// added crerate & update time in document
sessionSchema.plugin(timeStamp);

const Session = mongoose.model("Session", sessionSchema);
export default Session;