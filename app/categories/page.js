"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "../componenets/categoryCard";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";
import Link from "next/link";

export default function ExploreAllCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://anishop-backend-test.onrender.com/api/v1/category');
      const data = await res.json();
      setCategories(data.categories);
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
      <div className="min-h-screen bg-[#191919] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />
      
      <main className="container mx-auto px-4 pt-36 pb-36 content-center ">
        <h1 className="text-white text-4xl font-bold mb-8">BROWSE BY CATEGORY</h1>
        
        <div className="">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        
      </main>

      <footer className="border-t border-[#FFFFFF1A] mt-auto">
            <Footer />
      </footer>
    </div>
  );
}