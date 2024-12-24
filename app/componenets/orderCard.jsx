const OrderCard = () => {
    return (
        <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 flex flex-col">
            {/* Top Section */}
            <div className="flex items-start">
                {/* Image */}
                <img
                    src="https://seller-product-images.s3.amazonaws.com/products/2024/12/07/a30e2cd1-629e-4e6a-9239-a762b1b0219a_Screenshot__256_.png"
                    alt="Product"
                    className="w-20 h-20 rounded-md object-cover"
                />
                {/* Details */}
                <div className="ml-4 flex-1 ">
                    <h3 className="text-lg font-semibold">KING Oversized Sweatshirt</h3>
                    <p className="text-sm text-gray-400">Size XL</p>
                    <div className="flex items-center mt-2">
                        <p className="text-yellow-400 text-sm font-medium flex items-center">
                            Out of Delivery
                            <span className="ml-1">⏳</span>
                        </p>
                        <button className="ml-auto text-green-400 font-medium">
                            Check Status &gt;
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Order#: 7282736</p>
                </div>
                {/* Options */}
                <div className="ml-2">
                    <button className="text-gray-400 hover:text-gray-200">
                        •••
                    </button>
                </div>
            </div>
            {/* Bottom Section */}
            <div className="flex items-center border-t border-gray-800 mt-4 pt-3">
                <button className="flex-1 text-center text-green-400 font-medium hover:text-green-300">
                    Rate Product
                </button>
                <div className="border-l border-gray-800 h-4"></div>
                <button className="flex-1 text-center text-gray-400 font-medium hover:text-gray-200">
                    Share
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
