import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismaClient";

const getAllProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany();
      if (products.length !== 0) {
        return res.status(200).json(products);
      }
      res.status(200).json({ msg: "products is empty." });
    } catch (err) {
      res.status(500).json(err);
    }
  }else{
    res.status(405).json({msg: "method do not accept."});
  }
}

export default getAllProduct;