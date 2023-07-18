// import controller
import { checkValidateErr } from "../controller";
// import modules
// import types
import Express from "express";

export default class {
    // make all route validator

    static async contentValidator(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let err: string[] = [];
        let { contact, personal, skills, HTML_head } = req.body;
        (async () => {
            // check contact
            new Promise((resolve, reject) => {
                if (contact && typeof contact !== "object") contact = JSON.parse(contact);
                if (contact && typeof contact === "object" && !Array.isArray(contact)) {
                    if (contact.hasOwnProperty("other") && contact.other.length) {
                        contact.other = contact.other.filter((item: any) => item !== "");
                        for (let i = 0; i < contact.other.length; i++) {
                            if (contact.other[i].length !== 2) return reject(`contact.other[${i}] should have 2 index`);
                            if (contact.other[i][0] === "") contact.other.splice(i, 1)
                        }
                    }
                    req.body.contact = contact;
                    resolve(true);
                } else reject("contact should be an object");
            }).catch((v) => { err.push(v) });
            // check personal
            new Promise((resolve, reject) => {
                if (personal && typeof personal !== "object") personal = JSON.parse(personal);
                if (personal && typeof personal === "object" && !Array.isArray(personal)) {
                    // if (personal.hasOwnProperty("marital") && personal.marital !== true && personal.marital !== false
                    //     && personal.marital !== "true" && personal.marital !== "false" && personal.marital !== "")
                    //     return reject("personal.marital should be empty or a boolean");
                    req.body.personal = personal;
                    resolve(true);
                } else reject("personal should be an object!");
            }).catch((v) => { err.push(v) });
            // check skills
            new Promise((resolve, reject) => {
                if (skills && typeof skills !== "object") skills = JSON.parse(skills);
                if (skills && typeof skills === "object" && Array.isArray(skills)) {
                    if (skills.length)
                        skills = skills.filter((item: any) => item !== "");
                    for (let i = 0; i < skills.length; i++) {
                        if (skills[i].length !== 2) return reject(`skills[${i}] should have 2 index`);
                        if (Number(skills[i][1]) > 5 || Number(skills[i][1]) < 1)
                            return reject(`count of skill in skills[${i}][1] should between 1 to 5`);
                        if (skills[i][0] === "") skills.splice(i, 1)
                    }
                    req.body.skills = skills;
                    resolve(true);
                } else reject("skills should be an array!");
            }).catch((v) => { err.push(v); });
            // check HTML_head
            new Promise((resolve, reject) => {
                if (HTML_head && typeof HTML_head !== "object") HTML_head = JSON.parse(HTML_head);
                if (HTML_head && typeof HTML_head === "object" && !Array.isArray(HTML_head)) {
                    if (HTML_head.hasOwnProperty("other") && HTML_head.other.length) {
                        HTML_head.other = HTML_head.other.filter((item: any) => item !== "");
                        for (let i = 0; i < HTML_head.other.length; i++) {
                            if (HTML_head.other[i].length !== 2) return reject(`HTML_head.other[${i}] should have 2 index`);
                            if (HTML_head.other[i][0] === "") HTML_head.other.splice(i, 1)
                        }
                    }
                    req.body.HTML_head = HTML_head;
                    resolve(true);
                } else reject("HTML_head should be an object");
            }).catch((v) => { err.push(v) });
        })().finally(() => { checkValidateErr(req, res, next, err, "render-nodb","edit/content"); });
    }
};