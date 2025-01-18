"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';

const Reviews = ({ reviews = [] }) => {
    const [visibleReviews, setVisibleReviews] = useState(3);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                size={16}
                className={`${index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'
                    }`}
            />
        ));
    };

    const handleLoadMore = () => {
        setVisibleReviews(prev => prev + 3);
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-[#191919] p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
                <div className="text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review this product!
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#191919] p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
            <div className="space-y-6">
                {reviews.slice(0, visibleReviews).map((review) => (
                    <div key={review.id} className="border-b border-gray-800 pb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-white font-semibold">{review.username}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm">
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                        <p className="text-gray-300 mt-2">{review.comment}</p>
                    </div>
                ))}
            </div>

            {visibleReviews < reviews.length && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="bg-[#FF3333] text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Load More Reviews
                    </button>
                </div>
            )}
        </div>
    );
};

export default Reviews;