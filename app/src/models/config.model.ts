import { Schema, model, Document } from "mongoose";

interface IConfig extends Document {
    _id: string;
    roles: {
        [key: string]: string;
    };
    channels: {
        [key: string]: string;
    };
    plugins: {
        [key: string]: boolean;
    };
}

const configSchema = new Schema<IConfig>({
    _id: {
        type: String,
        required: true,
    },
    roles: {
        type: Map,
        of: String,
        required: true,
    },
    channels: {
        type: Map,
        of: String,
        required: true,
    },
    plugins: {
        type: Map,
        of: Boolean,
        required: true,
    },
});

const ConfigModel = model<IConfig>("Config", configSchema);

export { ConfigModel, IConfig };
