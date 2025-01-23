import { ArrowLeft, ArrowRight } from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-between px-4 mb-20 container mx-auto mt-10">
            {/* Previous Button */}
            <button
                className={`px-6 py-2 rounded-md flex items-center justify-center text-sm ${currentPage === 1
                    ? 'bg-gray-700 opacity-50 text-white cursor-not-allowed'
                        : 'bg-white text-black hover:opacity-80'
                    }`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeft size={16} className="mr-2"/> Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === i + 1
                                ? 'bg-white text-black shadow-md'
                            : 'text-[#FFFFFF80] hover:bg-gray-600 hover:text-white'
                            }`}
                        onClick={() => onPageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                className={`px-6 py-2 rounded-md flex items-center justify-center text-sm ${currentPage === totalPages
                        ? 'bg-gray-700 opacity-50 text-white cursor-not-allowed'
                        : 'bg-white text-black hover:opacity-80'
                    }`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next <ArrowRight size={16} className="ml-2" />
            </button>
        </div>
    );
};
