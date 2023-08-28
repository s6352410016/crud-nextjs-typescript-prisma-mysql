import prisma from "@/libs/prismaClient";
import readFile from "@/libs/readFile";
import { NextApiHandler } from "next";

export const config = {
    api: {
        bodyParser: false
    }
}

const storeProduct: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { fields, files } = await readFile(req, true);
            const { product_name, product_price } = fields;
            const newFileName = files.product_image[0].newFilename;
            await prisma.product.create({
                data: {
                    product_name: product_name[0],
                    product_price: parseFloat(product_price[0]),
                    product_image: newFileName
                }
            });
            res.status(201).json({ msg: "product created successfully." });
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(405).json({ msg: "method do not accept." });
    }
}

export default storeProduct;