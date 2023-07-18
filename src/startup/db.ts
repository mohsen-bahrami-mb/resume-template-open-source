// import modules
import mongoose from "mongoose";
import debug from "debug"

const mainDebug = debug("app:main")

export default function (): void {
    // try to connect to database
    mongoose.connect(<string>process.env.DB_ADDRESS)
        .then(() => mainDebug("connect to mongodb"))
        .catch(() => mainDebug("could not connect to mongodb"));
}