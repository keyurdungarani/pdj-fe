import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { X } from 'react-feather';
import './ImagePreview.css';

/**
 * Image Preview component that shows a larger version of an image when clicked
 * Can be used for both thumbnails in lists and for gallery management
 */
const ImagePreview = ({ 
  src, 
  alt = "Image preview", 
  thumbnailHeight = "80px",
  placeholderImage = "/placeholder-image.svg",
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  // Get fallback image if the src is falsy or there was an error loading it
  const imageSrc = (!src || imageError) ? placeholderImage : src;
  
  return (
    <>
      <div 
        className={`image-preview-thumbnail ${className}`} 
        onClick={toggleModal}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={imageSrc} 
          alt={alt} 
          style={{ height: thumbnailHeight, objectFit: 'contain' }} 
          onError={handleImageError}
        />
      </div>
      
      <Modal 
        show={showModal} 
        onHide={toggleModal} 
        centered 
        size="lg"
        dialogClassName="image-preview-modal"
        contentClassName="image-preview-content"
      >
        <div className="modal-close-button">
          <Button variant="link" onClick={toggleModal} className="p-0 border-0">
            <X size={24} />
          </Button>
        </div>
        <Modal.Body className="p-0">
          <div className="image-container">
            <img 
              src={imageSrc} 
              alt={alt} 
              className="preview-image"
              onError={handleImageError}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImagePreview; 