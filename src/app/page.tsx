"use client";
import LoginButton from '@/components/LoginButton'
import auth0 from '../../public/auth0.png'
import nextjs from '../../public/nextjs.webp'
import react from '../../public/react.png'
import tailwind from '../../public/tailwind.png'
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [imageIdx, setImageIdx] = useState(0)
  const images = [auth0, nextjs, react, tailwind]
  const totalImages = images.length

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageIdx((prevIndex) => (prevIndex + 1) % totalImages)
    }, 4000)

    return () => clearTimeout(timer)
  }, [imageIdx, totalImages])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-8 lg:gap-12">
        

        <div className="hidden md:block w-full lg:w-1/2 max-w-md">
          <div className="relative h-64 md:h-80 w-full">
            {images.slice(imageIdx, imageIdx + 1).map((image, index) => (
              <div 
                key={index} 
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              >
                <Image
                  src={image}
                  alt="Technology logo"
                  width={300}
                  height={150}
                  className="object-contain w-full h-full"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          
          
          <div className="flex justify-center mt-4 space-x-2 md:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImageIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === imageIdx ? 'bg-black w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>


        <div className="w-full lg:w-1/2 max-w-lg">
          <div className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0)] p-6 md:p-8 bg-white rounded-lg">
            <div className="text-center">
              <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-tight">
                Hi there! Welcome to NextAuth
              </h1>
              <p className="font-semibold mt-3 md:mt-4 text-lg md:text-xl">
                Login to continue.
              </p>
            </div>
            
           
            <div className="mt-6 md:hidden">
              <div className="relative h-48 w-full mx-auto">
                {images.slice(imageIdx, imageIdx + 1).map((image, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <Image
                      src={image}
                      alt="Technology logo"
                      width={200}
                      height={100}
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex justify-center">
              <div className="w-[50%] md:w-[30%] mt-5 max-w-xs mx-auto">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}