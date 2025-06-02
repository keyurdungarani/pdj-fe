import React from 'react';

const Rings = () => {
  return (
    <div className="container mx-auto pt-24 px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Fine Rings Collection</h1>
      <div className="bg-white shadow-md rounded-lg p-8">
        <p className="text-gray-700 mb-4">
          Explore our stunning collection of rings, from elegant engagement rings to timeless wedding bands 
          and statement pieces for any occasion.
        </p>
        <p className="text-gray-700 mb-4">
          Each ring in our collection is crafted with precision and care, using only the finest materials 
          to ensure lasting beauty and quality.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <p className="text-center text-amber-800">
            This page is currently under construction. Our complete ring collection will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rings;
