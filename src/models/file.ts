// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        default: "",
        set: (v: string) => {
            let p = v.replace(/\\/g, "/");
            if (p.startsWith("public")) p = p.substring(6);
            return p;
        }
    },
    path_reduce_file: {
        type: String,
        default: "",
        set: (v: string) => {
            let p = v.replace(/\\/g, "/");
            if (p.startsWith("public")) p = p.substring(6);
            return p;
        }
    }
});
// added crerate & update time in document
fileSchema.plugin(timeStamp);

const File = mongoose.model("File", fileSchema);
export default File;