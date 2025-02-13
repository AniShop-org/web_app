"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "../componenets/categoryCard";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";
import { useRouter } from "next/navigation";

export default function ExploreAllCategories() {
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://anishop-backend-test.onrender.com/api/v1/category');
      const data = await res.json();
      setCategories(data.categories);
      setCount(data.numberOfProductsPerCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191919] flex flex-col">
        <TopBar />
        <main className="container mx-auto px-4 md:pt-36 pt-20 pb-36 content-center flex-grow">
          <h1 className="text-white sm:text-3xl text-xl font-bold mb-8">Browse by category</h1>
          <div className="flex justify-center content-center pt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
          </div>
        </main>
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#191919]">
      <TopBar />
      <main className="container mx-auto px-4 md:pt-36 pt-20 pb-36 content-center flex-grow">
        <div className="flex sm:gap-4 gap-2">
        <button
          onClick={() => router.push('/')}
          className="pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-4 sm:h-6 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
          <h1 className="text-white sm:text-3xl text-xl font-bold">Browse by category</h1>
        </div>
        <div className="mt-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} count={count[index]} />
          ))}
        </div>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
