import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Info, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Download
} from 'lucide-react';

const JewelryBulkUploadGuide = ({ onDownloadTemplate }) => {
  const [expandedSections, setExpandedSections] = useState({
    required: true,
    recommended: false,
    styles: false,
    metals: false,
    examples: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const requiredFields = [
    {
      field: 'Stock Number',
      description: 'Unique identifier for the jewelry item',
      example: 'JW001, RING-001, BR-2024-001',
      validation: 'Must be unique across all jewelry items'
    },
    {
      field: 'Jewelry Style',
      description: 'Specific style category of the jewelry',
      example: 'Solitaire Engagement Ring, Tennis Bracelet, Stud Earrings',
      validation: 'Must match one of the predefined VDB jewelry styles'
    },
    {
      field: 'Jewelry Classification',
      description: 'Type of stones used in the jewelry',
      example: 'Natural Diamond, Lab-Grown Diamond, Other',
      validation: 'Required for proper categorization'
    },
    {
      field: 'Image Link',
      description: 'URL to the main product image',
      example: 'https://example.com/jewelry/ring1.jpg',
      validation: 'Must be a valid URL to an accessible image'
    }
  ];

  const recommendedFields = [
    {
      field: 'Center Stone Type',
      description: 'Type of center stone (if applicable)',
      example: 'Natural Diamond, Lab-Grown Diamond, Gemstone, None'
    },
    {
      field: 'Side Stone Type',
      description: 'Type of side stones (if applicable)',
      example: 'Natural Diamond, Lab-Grown Diamond, Gemstone, None'
    },
    {
      field: 'Total Carat Weight',
      description: 'Combined weight of all stones',
      example: '1.5, 2.25, 5.0'
    },
    {
      field: 'Total Price',
      description: 'Selling price of the jewelry item',
      example: '15000, 25000, 5500'
    },
    {
      field: 'Metal',
      description: 'Metal type and karat',
      example: '18K White Gold, 14K Yellow Gold, Platinum'
    }
  ];

  const jewelryStyles = [
    'Solitaire Engagement Ring', 'Three Stone Engagement Ring', 'Side Stone Engagement Ring',
    'Halo Engagement Ring', 'Gemstone Engagement Ring', 'Vintage Engagement Ring',
    'Diamond Wedding Band', 'Plain Wedding Band', 'Eternity Wedding Band',
    "Men's Wedding Band", 'Stacking Wedding Band', 'Gemstone Wedding Band',
    "Men's Fashion Ring", "Women's Fashion Ring", 'Earring Studs', 'Fashion Studs',
    'Drop Earrings', 'Chandelier Earrings', 'Hoop Earrings', 'Tennis Bracelet',
    'Bangle Bracelet', 'Cuff Bracelet', 'Link Bracelet', 'Fashion Bracelet',
    'Tennis Necklace', 'Wreath Necklace', 'Lariat Necklace', 'Choker Necklace',
    'Pendant', 'Single Strand Pearl Necklace', 'Fashion Pearl Necklace',
    'Pearl Bracelet', 'Pearl Earrings', 'Pearl Pendant', 'Pearl Ring'
  ];

  const metalTypes = [
    '10K White Gold', '14K White Gold', '18K White Gold', '21K White Gold',
    '10K Yellow Gold', '14K Yellow Gold', '18K Yellow Gold', '22K Yellow Gold', '24K Yellow Gold',
    '10K Rose Gold', '14K Rose Gold', '18K Rose Gold', '21K Rose Gold',
    'Platinum', 'Silver', 'Mix Metal', 'Two Tone'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Jewelry Bulk Upload Guide</h2>
        <p className="text-gray-600">
          Complete guide for uploading jewelry inventory using VDB-compliant CSV format
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900">Ready to Upload?</h3>
              <p className="text-blue-700 text-sm">Download the template and start adding your jewelry inventory</p>
            </div>
          </div>
          <button
            onClick={onDownloadTemplate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Download Template</span>
          </button>
        </div>
      </div>

      {/* Required Fields Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('required')}
          className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-600" size={20} />
            <h3 className="font-semibold text-red-900">Required Fields (Must be provided)</h3>
          </div>
          {expandedSections.required ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {expandedSections.required && (
          <div className="mt-4 space-y-4">
            {requiredFields.map((field, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-red-500 mt-1" size={16} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{field.field}</h4>
                    <p className="text-gray-600 text-sm mt-1">{field.description}</p>
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500">Example:</span>
                      <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{field.example}</code>
                    </div>
                    {field.validation && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-red-600">Validation:</span>
                        <span className="ml-2 text-xs text-red-600">{field.validation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Fields Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('recommended')}
          className="w-full flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Info className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-yellow-900">Recommended Fields (Highly suggested)</h3>
          </div>
          {expandedSections.recommended ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {expandedSections.recommended && (
          <div className="mt-4 space-y-4">
            {recommendedFields.map((field, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="text-yellow-500 mt-1" size={16} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{field.field}</h4>
                    <p className="text-gray-600 text-sm mt-1">{field.description}</p>
                    {field.example && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-500">Example:</span>
                        <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{field.example}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jewelry Styles Reference */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('styles')}
          className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="font-semibold text-green-900">Valid Jewelry Styles</h3>
          </div>
          {expandedSections.styles ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {expandedSections.styles && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              Your "Jewelry Style" field must exactly match one of these values:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {jewelryStyles.map((style, index) => (
                <code key={index} className="text-xs bg-gray-100 px-2 py-1 rounded block">
                  {style}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metal Types Reference */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('metals')}
          className="w-full flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-purple-600" size={20} />
            <h3 className="font-semibold text-purple-900">Valid Metal Types</h3>
          </div>
          {expandedSections.metals ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {expandedSections.metals && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              Your "Metal" field should match one of these values:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {metalTypes.map((metal, index) => (
                <code key={index} className="text-xs bg-gray-100 px-2 py-1 rounded block">
                  {metal}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Examples Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('examples')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-900">Example CSV Rows</h3>
          </div>
          {expandedSections.examples ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {expandedSections.examples && (
          <div className="mt-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Engagement Ring Example</h4>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
                <div>Stock Number: JW001</div>
                <div>Jewelry Style: Solitaire Engagement Ring</div>
                <div>Jewelry Classification: Natural Diamond</div>
                <div>Center Stone Type: Natural Diamond</div>
                <div>Total Carat Weight: 1.5</div>
                <div>Total Price: 15000</div>
                <div>Metal: 18K White Gold</div>
                <div>Image Link: https://example.com/ring1.jpg</div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Tennis Bracelet Example</h4>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
                <div>Stock Number: JW002</div>
                <div>Jewelry Style: Tennis Bracelet</div>
                <div>Jewelry Classification: Natural Diamond</div>
                <div>Center Stone Type: Natural Diamond</div>
                <div>Side Stone Type: Natural Diamond</div>
                <div>Total Carat Weight: 5.0</div>
                <div>Total Price: 25000</div>
                <div>Metal: 14K Yellow Gold</div>
                <div>Image Link: https://example.com/bracelet1.jpg</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">Important Notes</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• All stock numbers must be unique across your entire jewelry inventory</li>
          <li>• Image links must be publicly accessible URLs</li>
          <li>• Jewelry Style values are case-sensitive and must match exactly</li>
          <li>• Center and Side Stone details are optional but recommended for diamond jewelry</li>
          <li>• Use the template provided to ensure proper formatting</li>
          <li>• Test with a small batch first before uploading large inventories</li>
        </ul>
      </div>
    </div>
  );
};

export default JewelryBulkUploadGuide; 