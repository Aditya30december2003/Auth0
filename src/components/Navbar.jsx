import React from 'react'
import { FaKey } from "react-icons/fa";
const Navbar = () => {
  return (
     <div className='mx-auto w-full font-bold'>
        <div className='w-[80%] justify-center md:justify-center p-2 lg:w-[30%] mx-auto text-[2rem] md:text-[2.5rem] lg:text-[2.9rem] py-2 flex items-center gap-5'>
          <div><FaKey/></div>
        <h1>NextAuth</h1>
        </div>
      </div>
  )
}

export default Navbar
