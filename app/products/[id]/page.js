"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ProductDetail from "../../componenets/productDetail";
import { TopBar } from "@/app/componenets/topbar";
import Footer from "@/app/componenets/footer";

export default function Product() {
    const productId = useParams().id;
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://anishop-backend-test.onrender.com/api/v1/products/${productId}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, []);

    return (
        <div className="bg-[#191919] min-h-screen flex flex-col">
            <div className="pb-28">
                <TopBar />
            </div>
            <div className="flex-grow">
                {isLoading ? (
                    <div></div>
                ) : (
                    <div>
                        <div className="container mx-auto">
                            <ProductDetail key={product.id} product={product} />
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )

}