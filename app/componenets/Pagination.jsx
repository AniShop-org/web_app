
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                className="px-3 py-1 rounded-lg bg-gray-800 text-white"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-red-500' : 'bg-gray-800'
                        } text-white`}
                    onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className="px-3 py-1 rounded-lg bg-gray-800 text-white"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};