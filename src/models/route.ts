// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
export const routeTypeEnum: string[] | [] = ["main", "dynamic"];
export const routeIssueEnum: string[] | [] = ["create", "update"];

const routeSchema = new mongoose.Schema({
    route: { type: String, required: true, unique: true },
    type: { type: String, enum: routeTypeEnum },
    issue: { type: [String], enum: routeIssueEnum },
    is_protect_user: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    content: String
});
// added crerate & update time in document
routeSchema.plugin(timeStamp);

const Route = mongoose.model("Route", routeSchema);
export default Route;