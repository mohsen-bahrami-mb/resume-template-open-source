// define "mongoose-timestamp" declaration file
declare module "mongoose-timestamp" {
    import { Schema, Plugin } from "mongoose";
    
    function timestampsPlugin(schema, options): Plugin<any>;
    export default timestampsPlugin;
}