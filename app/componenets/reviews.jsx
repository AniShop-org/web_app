"use client";

import { useState } from "react";
import { CircleCheck, MessageSquare } from "lucide-react";

const Reviews = ({ reviews = [] }) => {
    const [visibleReviews, setVisibleReviews] = useState(6);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return Array.from({ length: 5 }, (_, index) => {
            if (index < fullStars) return '★';
            if (index === fullStars && hasHalfStar) return '★';
            return '☆';
        }).join('');
    };

    const handleLoadMore = () => {
        setVisibleReviews((prev) => prev + 4);
    };

    const handleShowLess = () => {
        setVisibleReviews((prev) => Math.max(6, prev - 4));
    };

    return (
        <div className="p-6 text-white container mx-auto">
            <h1 className="mb-12 sm:text-2xl text-xl font-bold">All Reviews</h1>
            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-200 mb-2">
                        No Reviews Yet
                    </h3>
                    <p className="text-gray-400 text-center">
                        Be the first one to review this product!
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {reviews.slice(0, visibleReviews).map((review) => (
                            <div
                                key={review.id}
                                className="h-56 p-4 bg-[#191919] rounded-2xl shadow-md border border-[#FFFFFF1A] flex flex-col"
                            >
                                {/* Header - Static */}
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-1 text-yellow-400 text-2xl">
                                            {renderStars(review.rating)}
                                        </div>
                                        <div className="flex items-center pt-2">
                                            <h3 className="font-semibold">
                                                {review.username}
                                            </h3>
                                            <CircleCheck
                                                size={22}
                                                color="black"
                                                fill="green"
                                                className="ml-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Comment - Scrollable */}
                                <div className="flex-1 overflow-y-auto mb-4">
                                    <p className="text-gray-300">{review.comment}</p>
                                </div>

                                {/* Footer - Static */}
                                <div>
                                    <span className="text-gray-400 text-sm">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center space-x-4">
                        {visibleReviews < reviews.length && (
                            <button
                                onClick={handleLoadMore}
                                className="bg-[#FF3333] text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                Load More
                            </button>
                        )}

                        {visibleReviews > 6 && (
                            <button
                                onClick={handleShowLess}
                                className="bg-[#FF3333] text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Reviews;