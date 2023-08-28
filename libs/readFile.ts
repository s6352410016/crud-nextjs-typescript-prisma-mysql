import formidable from "formidable";
import { NextApiRequest } from "next";
import path from "path";
import { uuid } from "uuidv4";

const readFile = async (req: NextApiRequest, saveLocally?: boolean): Promise<{fields: formidable.Fields , files: formidable.Files}> => {
    const options: formidable.Options = {};
    if(saveLocally){
        options.uploadDir = path.join(process.cwd() , "public" , "images");
        options.filename = (name , ext , path , form) => {
            const fileExt = path.originalFilename?.split(".")[1];
            return `${uuid()}.${fileExt?.toLowerCase()}`;
        }
    }

    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            }
            resolve({ fields, files });
        });
    });
}

export default readFile;