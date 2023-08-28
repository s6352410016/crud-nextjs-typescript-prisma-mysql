import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import Layout from "@/layout/Layout";

const AddProduct = () => {
    const router = useRouter();

    const [productName, setProductName] = useState<string>("");
    const [productPrice, setProductPrice] = useState<number>(0);
    const [fileProductImage, setFileProductImage] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");

    const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (productName.trim() !== "" && productPrice.toString().trim() !== "" && selectedImage !== "" && fileProductImage !== null) {
                const formData = new FormData();
                formData.append("product_name", productName);
                formData.append("product_price", productPrice.toString());
                formData.append("product_image", fileProductImage);
                const response = await axios.post(`${process.env.DOMAIN_NAME}/api/storeProduct`, formData);
                if (response.status === 201) {
                    Swal.fire(
                        'Product created successfully!',
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
        }
    }

    return (
        <Layout pageTitle="addProduct">
            <Container>
                <h3 className="mt-5 mb-3 text-center">Add Product</h3>
                <Form onSubmit={(e) => addProduct(e)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setProductName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control type="number" required onChange={(e) => setProductPrice(parseFloat(e.target.value))} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control type="file" required onChange={handleFileSelect} />
                    </Form.Group>
                    {selectedImage !== "" &&
                        <div className="mb-3">
                            <Image src={selectedImage} width={250} height={250} alt="previewImage"></Image>
                        </div>
                    }
                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </Container>
        </Layout>
    )
}

export default AddProduct;