import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Rings = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to jewelry page with ring category filter
    navigate('/jewelry?category=ring', { replace: true });
  }, [navigate]);

  return (
    <div className="container mx-auto pt-24 px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Rings Collection</h1>
      <div className="bg-white shadow-md rounded-lg p-8">
        <p className="text-center text-gray-600">Redirecting to our ring collection...</p>
      </div>
    </div>
  );
};

export default Rings;
