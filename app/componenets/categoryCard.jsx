import { useRouter } from "next/navigation";

export const CategoryCard = ({ category, count }) => {
    const router = useRouter();

    return (
        <div
            className="flex items-center justify-between w-full p-4 hover:bg-[#FFFFFF0A] cursor-pointer border-b border-[#FFFFFF1A]"
            onClick={() => router.push(`/categories/${category.id}`)}
        >
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 overflow-hidden rounded">
                    <img
                        src={category.image}
                        alt={category.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div>
                    <h3 className="text-white text-lg font-bold">{category.name}</h3>
                    <p className="text-[#767676]">{count.productCount} Products</p>
                </div>
            </div>
            <div className="text-gray-400">
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7.5 15l5-5-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            
        </div>
    );
};