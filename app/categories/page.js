"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "../componenets/categoryCard";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";
import Link from "next/link";

export default function ExploreAllCategories() {
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        <main className="container mx-auto px-4 pt-36 pb-36 content-center flex-grow">
          <h1 className="text-white text-4xl font-bold mb-8">BROWSE BY CATEGORY</h1>
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
      <main className="container mx-auto px-4 pt-36 pb-36 content-center flex-grow">
        <h1 className="text-white text-4xl font-bold mb-8">BROWSE BY CATEGORY</h1>
        <div>
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
