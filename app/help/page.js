"use client";

import { ChevronRight } from "lucide-react";
import { FAQItem } from "../componenets/faqItem";
import { TopBar } from "../componenets/topbar";
import { useEffect, useState } from "react";
import Footer from "../componenets/footer";

export default function HelpCenter() {
    const [faqItems, setFAQItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFAQItems = async () => {
        try {
            const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/admin/workspace/faq');
            const data = await response.json();
            setFAQItems(data.data);
        } catch (error) {
            console.error('Error fetching FAQ items:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchFAQItems();
    }, []);

    return (
        <div className="min-h-screen bg-[#191919]">
            <TopBar />
            <div className="container mx-auto px-4 pt-36 pb-12">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-gray-400 mb-8">
                    <a href="/" className="hover:text-white">Home</a>
                    <ChevronRight size={16} />
                    <span className="text-white">Help center</span>
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-20">
                    {/* Left Column - FAQs */}
                    <div className="flex-1">
                        <h1 className="text-white text-4xl font-bold mb-8">We're Here to Help You!</h1>
                        <h2 className="text-white text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                        <hr className="h-2 text-white"></hr>
                        <div className="space-y-6 mb-12">
                            {faqItems.map((item, index) => (
                                <FAQItem key={index} {...item} />
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Contact Sections */}
                    <div className="lg:w-1/3 space-y-12">
                        {/* Get in Touch Section */}
                        <div className="text-white">
                            <h2 className="text-3xl font-semibold mb-1 lg:pt-16">Get in Touch</h2>
                            <p className="mb-6 text-[#F1F1F1]">If you have any inquiries get in touch with us,<br />
                            We'll be happy to help you.</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-white">Contact no.</p>
                                    <p>+91 9876543210</p>
                                </div>
                                <div>
                                    <p className="text-white">What's app no.</p>
                                    <p>+91 9876543210</p>
                                </div>
                                <div>
                                    <p className="text-white">Enter your email</p>
                                    <p>example@example.com</p>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

