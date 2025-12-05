import React from 'react';

const Footer= () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">NextAuth</h2>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <div className="mt-2 space-x-4">
            Made by Aditya Jain
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;