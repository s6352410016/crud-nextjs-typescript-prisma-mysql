import prisma from "@/libs/prismaClient";
import fs from "fs/promises";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "DELETE") {
        try {
            const { deleteProduct } = req.query;
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt((<string>deleteProduct))
                }
            });
            if (product) {
                await fs.unlink(path.join(process.cwd(), "public", "images", `${product.product_image}`));
                await prisma.product.delete({
                    where: {
                        id: parseInt((<string>deleteProduct))
                    }
                });
                return res.status(200).json({ msg: "product deleted successfully." });
            }
            res.status(404).json({ msg: "product not found." });
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(405).json({ msg: "method do not accept." });
    }
}

export default deleteProduct;