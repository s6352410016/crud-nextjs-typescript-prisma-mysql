import Layout from "@/layout/Layout";
import { Container, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { GetStaticPaths, GetStaticProps } from "next";

interface Product {
    id: number,
}

interface UpdateProductProps {
    product: {
        id: number,
        product_name: string,
        product_price: number,
        product_image: string,
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const { data } = await axios.get(`${process.env.DOMAIN_NAME}/api/getAllProduct`);
        const paths = data.map((product: Product) => ({
            params: {
                productId: product.id.toString()
            }
        }));
        return {
            paths,
            fallback: false
        };
    } catch (err) {
        console.log(err);
        return {
            paths: [],
            fallback: false
        };
    }
}

export const getStaticProps: GetStaticProps<UpdateProductProps> = async ({ params }) => {
    try {
        const { data } = await axios.get(`${process.env.DOMAIN_NAME}/api/getProductById/${params?.productId}`);
        return {
            props: {
                product: data
            }
        };
    } catch (err) {
        console.log(err);
        return {
            props: {
                product: {}
            }
        };
    }
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product }) => {
    const router = useRouter();

    const [productName, setProductName] = useState<string>("");
    const [productPrice, setProductPrice] = useState<number>(0);
    const [fileProductImage, setFileProductImage] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [hiddenCurrentImage, setHiddenCurrentImage] = useState<boolean>(false);

    const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const formData = new FormData();
            // กรณีไม่อัพโหลดรูปภาพ
            if (productName.trim() !== "" && productPrice.toString().trim() !== "" && selectedImage === "" && fileProductImage === null) {
                formData.append("product_name", productName);
                formData.append("product_price", productPrice.toString());
                const response = await axios.put(`${process.env.DOMAIN_NAME}/api/updateProduct/${product.id}`, formData);
                if (response.status === 200) {
                    Swal.fire(
                        'Product updated successfully!',
                        'You clicked the button!',
                        'success'
                    ).then(() => {
                        router.push("/");
                    });
                }
            }

            // กรณีอัพโหลดรูปภาพ
            if (productName.trim() !== "" && productPrice.toString().trim() !== "" && selectedImage !== "" && fileProductImage !== null) {
                formData.append("product_name", productName);
                formData.append("product_price", productPrice.toString());
                formData.append("product_image", fileProductImage);
                const response = await axios.put(`${process.env.DOMAIN_NAME}/api/updateProduct/${product.id}`, formData);
                if (response.status === 200) {
                    Swal.fire(
                        'Product updated successfully!',
                        'You clicked the button!',
                        'success'
                    ).then(() => {
                        router.push("/");
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileImage = e.target.files?.[0];
        if (fileImage) {
            const blobImage = URL.createObjectURL(fileImage);
            setSelectedImage(blobImage);
            setFileProductImage(fileImage);
            setHiddenCurrentImage(true);
        }
    }

    useEffect(() => {
        setProductName(product.product_name);
        setProductPrice(product.product_price);
    }, []);

    return (
        <Layout pageTitle="updateProduct">
            <Container>
                <h3 className="mt-5 mb-3 text-center">Update Product</h3>
                <Form onSubmit={(e) => updateProduct(e)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setProductName(e.target.value)} defaultValue={product.product_name} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control type="number" required onChange={(e) => setProductPrice(parseFloat(e.target.value))} defaultValue={product.product_price} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileSelect} />
                    </Form.Group>
                    {selectedImage !== "" &&
                        <div className="mb-3">
                            <Image src={selectedImage} width={250} height={250} alt="previewImage"></Image>
                        </div>
                    }
                    {hiddenCurrentImage === false &&
                        <div className="mb-3">
                            <Image src={`${process.env.DOMAIN_NAME}/images/${product.product_image}`} width={250} height={250} alt={product.product_image}></Image>
                        </div>
                    }
                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Container>
        </Layout >
    );
}

export default UpdateProduct;