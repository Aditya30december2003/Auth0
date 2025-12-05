"use client";
import LoginButton from '@/components/LoginButton'
import { FaKey } from "react-icons/fa";
import auth0 from '../../public/auth0.png'
import nextjs from '../../public/nextjs.webp'
import react from '../../public/react.png'
import tailwind from '../../public/tailwind.png'
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [imageIdx , setImageIdx] = useState(0)
  const images=[ auth0 , nextjs , react , tailwind]
  const totalImages=images.length

  useEffect(()=>{
     const timer= setTimeout(()=>{
        setImageIdx((prevIndex)=> (prevIndex+1)%totalImages) // circular image index fr loop
      },4000)

      return ()=>clearTimeout(timer) // clear mount
  },[imageIdx , totalImages])

  return (
    <div className="min-h-screen">
      {/* heading */}
      <div className='flex items-center gap-2 mx-auto w-[30%] text-[3.2rem] font-bold'>
        <div><FaKey/></div>
        <h1>NextAuth</h1>
      </div>

      <div className='flex items-center justify-between w-[65%] mx-auto mt-[10%]'>

      <div>
        {/* left logo container */}
       {images.slice(imageIdx , imageIdx+1).map((image)=>(
        <>
        <div>
          <Image
      src={image}
      alt="Description of my image"
      width={200}
      height={100}
    />
        </div>
        </>
       ))}
      </div>
      
      {/* login container */}
      <div  className='border-2 shadow-[10px_10px_0px_0px_rgba(0,0,0)] w-[50%] p-5'>
        <div>
        <h1 className='text-center font-bold text-[2rem]'>Hi there! Welcome to NextAuth</h1>
        <p className='font-bold mt-3 text-center'>Login to continue.</p>
        </div>
      <div className='mx-auto text-center mt-7 my-3'> <LoginButton/></div>
      </div>
      </div>
    </div>
  );
}
