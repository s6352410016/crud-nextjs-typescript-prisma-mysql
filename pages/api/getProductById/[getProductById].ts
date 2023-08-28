import prisma from "@/libs/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

const getProductById = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            const { getProductById } = req.query;
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt((<string>getProductById))
                }
            });
            if (product) {
                return res.status(200).json(product);
            }
            res.status(404).json({ msg: "product not found." });
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(405).json({ msg: "method do not accept." });
    }
}

export default getProductById;