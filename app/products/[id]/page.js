"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ProductDetail from "../../componenets/productDetail";
import { TopBar } from "@/app/componenets/topbar";
import Footer from "@/app/componenets/footer";
import SimilarProducts from "@/app/componenets/similarProduct";

export default function Product() {
    const productId = useParams().id;
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('category');
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/${productId}`);
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
            <div className="pb-10 lg:pb-28">
                <TopBar />
            </div>
            <div className="flex-grow">
                {isLoading ? (
                    <div className="flex justify-center content-center pt-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
                    </div> 
                ) : (
                    <div>
                        <div className="container mx-auto">
                            <ProductDetail key={product.id} product={product} />
                        </div>
                    </div>
                )}
            </div>
            <div className="mb-10">
                <SimilarProducts categoriId={categoryId} />
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )

}