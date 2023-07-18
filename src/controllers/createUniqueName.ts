// import modele
import User from "../models/user";

export async function createUsername(first_name: string, last_name: string): Promise<string> {
    // create username
    let username: string = (first_name + last_name).replace(/\s/g, "");
    const EnLetter = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "1234567890");
    const UnLetter = username.split("");
    const isEnglish = UnLetter.map(u => EnLetter.indexOf(u));
    if (isEnglish.includes(-1)) username = "madeusername";
    const userRegExp = new RegExp((username).toString() + "[0-9]*", "g");
    const macthUsernames = await User.find({ username: userRegExp }).select({ username: 1, _id: 0 });
    if (macthUsernames.length) {
        let maxCounter = Math.max(...macthUsernames.map(u => parseInt(u.username.replace(username, ""))));
        username = (username + (maxCounter + 1).toString());
    } else {
        username = (username + (0).toString());
    }
    return username;
}