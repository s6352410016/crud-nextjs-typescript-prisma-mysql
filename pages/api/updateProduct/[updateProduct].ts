import prisma from "@/libs/prismaClient";
import readFile from "@/libs/readFile";
import { NextApiHandler } from "next";
import fs from "fs/promises";
import path from "path";

export const config = {
    api: {
        bodyParser: false
    }
}

const updateProduct: NextApiHandler = async (req, res) => {
    if (req.method === "PUT") {
        try {
            const { updateProduct } = req.query;
            const { fields, files } = await readFile(req, true);
            const { product_name, product_price } = fields;

            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt(<string>updateProduct)
                }
            });
            // กรณีไอดีสินค้าถูก
            if (product) {
                // กรณีไม่อัพโหลดรูปภาพ
                if (Object.keys(files).length === 0) {
                    await prisma.product.update({
                        where: {
                            id: parseInt((<string>updateProduct))
                        },
                        data: {
                            product_name: product_name[0],
                            product_price: parseFloat(product_price[0])
                        }
                    });
                    return res.status(200).json({ msg: "product updated successfully." });
                }
                // กรณีอัพโหลดรูปภาพ
                const newFileName = files.product_image[0].newFilename;
                // ลบรูปภาพเดิมออก
                await fs.unlink(path.join(process.cwd(), "public", "images", `${product.product_image}`));
                await prisma.product.update({
                    where: {
                        id: parseInt((<string>updateProduct))
                    },
                    data: {
                        product_name: product_name[0],
                        product_price: parseFloat(product_price[0]),
                        product_image: newFileName
                    }
                });
                return res.status(200).json({ msg: "product updated successfully." });
            }
            // กรณีไอดีสินค้าผิด
            return res.status(404).json({ msg: "product not found." });
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(405).json({ msg: "method do not accept." });
    }
}

export default updateProduct;