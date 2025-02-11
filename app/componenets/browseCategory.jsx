import { useRouter } from "next/navigation";


const BrowseByCategory = ({categories}) => {
    const router = useRouter();
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-[#262626] rounded-3xl">
            <h2 className="lg:text-3xl text-xl font-bold text-center text-white mb-8">
                BROWSE BY CATEGORY
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer bg-white w-[305px] md:w-[250px] lg:w-full mx-auto"
                    >
                        <div className="relative h-[180px] md:h-[250px] lg:h-64">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-end ">
                                <div className="w-full flex justify-between items-center bg-black/60 backdrop-blur-sm">
                                    <h3 className="text-xl font-semibold text-white p-3">
                                        {category.name}
                                    </h3>
                                    <div className="px-3">
                                    <button
                                        className="bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                                        onClick={() => {
                                            router.push(`/categories/${category.id}`);
                                        }}
                                    >
                                        Explore
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => router.push('/categories')} className="block mx-auto mt-8 px-6 py-2 text-sm text-white border rounded-full bg-[#303030] transition-colors">
                Explore more
            </button>
        </div>
    );
};

export default BrowseByCategory;