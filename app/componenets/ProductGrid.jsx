import ProductCard from "./productCard";

export const ProductGrid = ({ products }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-2">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};