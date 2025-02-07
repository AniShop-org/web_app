import { ArrowLeft, ArrowRight } from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-2 mb-10 container mx-auto mt-10">
            <button
                className={`px-3 sm:px-6 py-2 rounded-md flex items-center justify-center text-sm sm:text-md ${currentPage === 1
                        ? 'bg-gray-700 opacity-50 text-white cursor-not-allowed'
                        : 'bg-white text-black hover:opacity-80'
                    }`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeft size={14} className="mr-1" /> Prev
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => (
                    <button
                        key={idx}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-md font-medium ${pageNum === currentPage
                                ? 'bg-white text-black shadow-md'
                                : pageNum === '...'
                                    ? 'text-[#FFFFFF80] cursor-default'
                                    : 'text-[#FFFFFF80] hover:bg-gray-600 hover:text-white'
                            }`}
                        onClick={() => pageNum !== '...' ? onPageChange(pageNum) : null}
                        disabled={pageNum === '...'}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>

            <button
                className={`px-3 sm:px-6 py-2 rounded-md flex items-center justify-center text-sm sm:text-md ${currentPage === totalPages
                        ? 'bg-gray-700 opacity-50 text-white cursor-not-allowed'
                        : 'bg-white text-black hover:opacity-80'
                    }`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next <ArrowRight size={14} className="ml-1" />
            </button>
        </div>
    );
};

export default Pagination;