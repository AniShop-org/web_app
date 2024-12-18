import Image from 'next/image';
import { TopBar } from '@/app/componenets/topbar.jsx';
import NewArrivals from './componenets/newArrivals';
import TopSelling from './componenets/topselling';

export default function Home() {
  return (
    <div className="bg-[#191919]">
      <div className="relative w-full min-h-screen">
        {/* Banner Image */}
        <div className="absolute inset-0">
          <Image 
            src="/main_banner.jpg" 
            alt="product banner" 
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        <TopBar/>
        
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-4 pb-8 lg:px-20 font-sans lg:pb-32 container">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="lg:text-lg text-gray-200 mb-8">
              Browse through our diverse range of meticulously crafted garments, 
              designed to bring out your individuality and cater to your sense of style.
            </p>
          </div>
        </div>
      </div>
      <div>
        <NewArrivals/>
      </div>
      <div className='h-0.5 lg:w-2/3 w-3/4 bg-[#FFFFFF1A] mx-auto'></div>
      <div>
        <TopSelling/>
      </div>
    </div>
  );
}