// import models
import Session from "../models/session";
// import module types
import Mongoose from "mongoose";

// set devices limit to keep in session
export default async function devicesLimit(user_id: Mongoose.Types.ObjectId | string, limitCount = 1): Promise<void> {
    const loginSession = await Session.find({ user_id, is_login: true }).sort({ updatedAt: 1 });
    if (loginSession.length > limitCount) {
        const notLoginSession = loginSession.splice(0, (loginSession.length - limitCount));
        const SessionId = notLoginSession.map(d => <Mongoose.Types.ObjectId | string>d.id);
        await Session.updateMany({ _id: { $in: SessionId } }, { $set: { is_login: false } }, { new: true });
    }
};