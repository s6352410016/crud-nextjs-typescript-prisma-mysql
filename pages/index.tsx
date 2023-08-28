import { Container, Table, Button } from "react-bootstrap";
import Image from "next/image";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from "next/router";
import { GetStaticProps } from "next";

interface HomeProps {
  id: number,
  product_name: string,
  product_price: number,
  product_image: string,
  createdAt: string,
  updatedAt: string,
}

interface Products {
  products: HomeProps;
}

interface Msg {
  msg: string
}

export const getStaticProps: GetStaticProps<Products> = async () => {
  try {
    const { data } = await axios.get(`${process.env.DOMAIN_NAME}/api/getAllProduct`);
    return {
      props: {
        products: data
      }
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        products: []
      }
    };
  }
}

const Home: React.FC<{ products: HomeProps[] | Msg }> = ({ products }) => {
  const router = useRouter();

  const confirmDeleteProduct = (productId: number) => {
    Swal.fire({
      title: 'Are you sure to delete this product?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'product deleted succesfully',
          'success'
        ).then(async () => {
          try {
            const response = await axios.delete(`${process.env.DOMAIN_NAME}/api/deleteProduct/${productId}`);
            if (response.status === 200) {
              router.push("/");
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  }

  return (
    <Container>
      <h3 className="mt-5 mb-3 text-center">Show All Products</h3>
      <Button variant="success mb-3" href="/views/addProduct">Add Product</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>product_id</th>
            <th>product_name</th>
            <th>product_price</th>
            <th>product_image</th>
            <th>create_at</th>
            <th>updated_at</th>
            <th>update</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {/* ใช้ Type Guard ในการเช็ค Props ที่เป็น Union Type ว่าถ้ามี Key msg ให้ทำอะไรต่อ*/}
          {"msg" in products && products.msg === "products is empty." &&
            <tr>
              <td colSpan={8} className="text-center">products is empty.</td>
            </tr>
          }
          {/* ใช้ Type Guard ในการเช็ค Props ที่เป็น Union Type ว่าถ้าเป็น Array ให้ทำไรต่อ*/}
          {!("msg" in products) && products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.product_name}</td>
              <td>{product.product_price} บาท</td>
              <td className="text-center">
                <Image src={`${process.env.DOMAIN_NAME}/images/${product.product_image}`} width={150} height={150} alt={product.product_image}></Image>
              </td>
              <td>{product.createdAt}</td>
              <td>{product.updatedAt}</td>
              <td>
                <Button variant="primary" href={`/views/updateProduct/${product.id}`}>update</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => confirmDeleteProduct(product.id)}>delete</Button>
              </td>
            </tr>
          ))
          }
        </tbody>
      </Table>
    </Container>
  );
}

export default Home;