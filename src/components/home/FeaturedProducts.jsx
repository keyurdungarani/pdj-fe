import { useState } from 'react';
import OrderModal from '../common/OrderModal';

function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${product.price}</span>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded"
          >
            Buy Now
          </button>
        </div>
      </div>
      <OrderModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        productDetails={product}
      />
    </div>
  );
}

function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Classic Diamond Ring",
      description: "1.5 Carat Solitaire Diamond Ring",
      price: "5,999",
      image: "/ring1.jpg"
    },
    {
      id: 2,
      name: "Wedding Band Set",
      description: "Matching Platinum Wedding Bands",
      price: "2,999",
      image: "/ring2.jpg"
    },
    {
      id: 3,
      name: "CVD Diamond",
      description: "2 Carat CVD Diamond, VS1 Clarity",
      price: "4,999",
      image: "/diamond1.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;