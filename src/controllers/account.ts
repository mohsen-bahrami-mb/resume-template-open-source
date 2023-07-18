// import modules
import fs from "fs";
import bcrypt from "bcrypt";
// import controllers
import { createUsername, logout, response } from "../routes/controller";
// import models
import User, { userVerifyEnum, userRoleEnum } from "../models/user";
// import middleware
// import types
import Express from "express";

/** this is a function to update self account when user is in own account 
 * @ if correct: @return : {`message`, `msg`, `userData`} and other propertys are `undefined`
 * @ if incorrect: @return : {`message`, `err`, `previous_field`} and other propertys are `undefined`
*/
export async function updateSelfAccount<T>(req: Express.Request, user: any | T) {
    let { first_name, last_name, password, new_password, new_password_repeat, phone, email, birth_date, location } = req.body;
    const err: string[] = [];
    let passChanged = false;
    // check phone or email is exist
    if ((!phone && !email) || (phone === "" && email === ""))
        err.push("حداقل یکی از موارد شماره موبایل یا ایمیل باید وجود داشته باشد");
    // check is new phone/email
    const destroyVerify: string[] = [];
    const searchOrQuery: object[] = [];
    let isExistPhoneEmail: any[] = [];
    if (phone.length && phone !== user.phone) { searchOrQuery.push({ phone }); destroyVerify.push("phone"); }
    if (email.length && email !== user.email) { searchOrQuery.push({ email }); destroyVerify.push("email"); }
    if (searchOrQuery.length) isExistPhoneEmail = await User.find().or(searchOrQuery);
    if (isExistPhoneEmail?.length) err.push(
        "کاربری با ایمیل یا شماره تلفن وارد شده، در وبسایت وجود دارد و نمیتوان از ایمیل یا شماره تلفن جدید وارد شده، استفاده کرد"
    );
    // create username
    let username: string = user.username;
    if (first_name !== user.first_name || last_name !== user.last_name)
        username = await createUsername(first_name, last_name);
    // destroy verify
    let verify: string[] = user.verify;
    if (destroyVerify.length && !isExistPhoneEmail)
        verify = user.verify.filter((v: string) => !destroyVerify.includes(v));
    // cheack password
    let isCorrect: boolean | undefined = undefined;
    if (destroyVerify.length || new_password.length > 0) isCorrect = await bcrypt.compare(password, user.password);
    // set new password
    if (new_password.length > 0 && new_password.length < 6)
        err.push("رمز عبور جدید باید حداقل ۶ کاراکتر داشته باشد");
    else if (new_password.length >= 6) {
        if (new_password !== new_password_repeat) err.push("رمز عبور جدید با تکرار آن تطابق ندارد");
        password = new_password;
        passChanged = true;
    }
    // hash password
    if (destroyVerify.length || passChanged) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
    }
    if (isCorrect === false) err.push(...[
        "رمز عبور شما صحیح نیست",
        "اگر رمزعبور خود را به یاد ندارید میتوانید از گزینه فراموشی رمز عبور استفاده کنید"
    ]);
    // errors result
    if (err.length) return {
        message: "recived invalid form data",
        err,
        previous_field: { first_name, last_name, phone, email, birth_date, location },
        msg: [],
        userData: undefined
    }
    // when changed password or important, set logout user in session
    if (passChanged || destroyVerify.length) await logout(req);
    // success result
    return {
        message: "successfully updated user account",
        msg: ["پروفایل کاربری با موفقیت به‌روز رسانی شد"],
        userData: {
            username,
            first_name,
            last_name,
            phone: phone.length > 0 ? phone : undefined,
            email: email.length > 0 ? email : undefined,
            ...(isCorrect && { password }),
            verify,
            location,
            ...((new Date(birth_date)).toDateString() !== "Invalid Date" && { birth_date })
        },
        err: [],
        previous_field: undefined,
    }
}

/** `JUST USE FOR OWNER ROLE`. this is a function to update other accounts.
 * @ if correct: @return : {`message`, `msg`, `userData`} and other propertys are `undefined`
 * @ if incorrect: @return : {`message`, `err`, `previous_field`} and other propertys are `undefined`
*/
export async function updateOtherAccount<T>(req: Express.Request, user: any | T) {
    let { first_name, last_name, new_password, new_password_repeat,
        phone, email, birth_date, location, role, verify, description } = req.body;
    const err: string[] = [];
    let passChanged = false;
    // check phone or email is exist
    if ((!phone && !email) || (phone === "" && email === ""))
        err.push("حداقل یکی از موارد شماره موبایل یا ایمیل باید وجود داشته باشد");
    // check is new phone/email
    const destroyVerify: string[] = [];
    const searchOrQuery: object[] = [];
    let isExistPhoneEmail: any[] = [];
    if (phone.length && phone !== user.phone) { searchOrQuery.push({ phone }); destroyVerify.push("phone"); }
    if (email.length && email !== user.email) { searchOrQuery.push({ email }); destroyVerify.push("email"); }
    if (searchOrQuery.length) isExistPhoneEmail = await User.find().or(searchOrQuery);
    if (isExistPhoneEmail?.length) err.push(
        "کاربری با ایمیل یا شماره تلفن وارد شده، در وبسایت وجود دارد و نمیتوان از ایمیل یا شماره تلفن جدید وارد شده، استفاده کرد"
    );
    // create username
    let username: string = user.username;
    if (first_name !== user.first_name || last_name !== user.last_name)
        username = await createUsername(first_name, last_name);
    // verify connection (phone, email)
    if (!verify || (verify && !Array.isArray(verify))) err.push("verify را حتی اگر وجود ندارد بصورت آرایه خالی بفرستید")
    else verify = verify.filter((v: string) => {
        if (v === "") return;
        if (userVerifyEnum.includes(v)) return v;
        else err.push(`${v} جز موارد تاییدیه کاربری نیست`);
        return;
    });
    // check is user role
    // // if (role && !(role && role === "user" || role === "admin")) { }      // maybe add in future for add admin role
    if (!role || (role && role !== "user")) err.push("نقش کاربر فقط میتواند user انتخاب شود");
    // set new password
    let password = user.password;
    if (new_password.length > 0 && new_password.length < 6)
        err.push("رمز عبور جدید باید حداقل ۶ کاراکتر داشته باشد");
    else if (new_password.length >= 6) {
        if (new_password !== new_password_repeat) err.push("رمز عبور جدید با تکرار آن تطابق ندارد");
        password = new_password;
        // hash password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        passChanged = true;
    }
    // errors result
    if (err.length) return {
        message: "recived invalid form data",
        err,
        previous_field: { first_name, last_name, phone, email, birth_date, location, role, verify },
        msg: [],
        userData: undefined
    }
    // when changed password, set logout user in session
    if (passChanged || destroyVerify.length) await logout(req, user.id);
    // success result
    return {
        message: "successfully updated user account",
        msg: ["پروفایل کاربر با موفقیت به‌روز رسانی شد"],
        userData: {
            username,
            first_name,
            last_name,
            phone: phone.length > 0 ? phone : undefined,
            email: email.length > 0 ? email : undefined,
            password,
            verify,
            role,
            location,
            ...((new Date(birth_date)).toDateString() !== "Invalid Date" && { birth_date }),
            description: description?.toString()
        },
        err: [],
        previous_field: undefined,
    }
}