import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Trash2,
  ArrowLeft,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';
import { productAPI } from '../../services/api';
import JewelryBulkUploadGuide from '../../components/admin/JewelryBulkUploadGuide';

const BulkUpload = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [notUploadedItems, setNotUploadedItems] = useState([]);
  const [showNotUploaded, setShowNotUploaded] = useState(false);
  const [showJewelryGuide, setShowJewelryGuide] = useState(false);

  const categories = [
    {
      id: 'lab-grown',
      name: 'Lab-Grown Diamonds',
      icon: FileSpreadsheet,
      description: 'Upload lab-grown diamonds from CSV file',
      templateName: 'lab-grown-diamond-template.csv',
      available: true
    },
    {
      id: 'natural-diamonds',
      name: 'Natural Diamonds',
      icon: FileSpreadsheet,
      description: 'Upload natural diamonds from CSV file',
      templateName: 'natural-diamond-template.csv',
      available: true
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      icon: FileSpreadsheet,
      description: 'Upload jewelry items from CSV file',
      templateName: 'jewelry-template.csv',
      available: true
    }
  ];

  const labGrownTemplate = `Stock #,Availability,Shape,Weight,Clarity,Color,Fancy Color,Fancy Color Intensity,Fancy Color Overtone,Price,Total Price,Discount Percent,Price Memo,Price Per Carat Memo,Discount Percent Memo,Image Link,Image Link 2,Image Link 3,Image Link 4,Image Link 5,Image Link 6,Video Link,Cut Grade,Polish,Symmetry,Depth Percent,Table Percent,Fluorescence Intensity,Fluorescence Color,Lab,Certificate #,Certificate Url,Cert Comment,Culet Condition,Culet Size,Girdle Percent,Girdle Condition,Girdle Thick,Girdle Thin,Measurements,Measurements Depth,Measurements Length,Measurements Width,Milky,Pavilion Depth,BGM,Crown Height,Crown Angle,Pavilion Angle,Laser Inscription,Member Comments,Pair,H&A,City,State,Country,Stock Number for Matching Pair,Share Access,Eye Clean,Featured,Table Open,Crown Open,Girdle Open,Star Length,Type,Tinge,Luster,Black Inclusion,Location of Black,Table Inclusion,Key To Symbol,Surface Graining,Internal Graining,Inclusion Pattern,Diamond Origin Report,Short Title,Arrival Date,Tags,Certificate Updated At,Growth Type
LG001,Available,Round,1.5,VS1,F,,,,5000,7500,10,,,,"https://example.com/image1.jpg","https://example.com/image2.jpg",,,,,"https://example.com/video.mp4",Excellent,Excellent,Excellent,62.5,57,None,,GIA,GIA12345,https://example.com/cert.pdf,,None,None,3.5,,Medium,Thin,"7.5x7.5x4.6",4.6,7.5,7.5,,62.5,No,15.5,34.5,40.8,GIA12345,"Excellent quality diamond",Single,None,"New York",NY,USA,,Yes,"Eye clean",No,,,3.5,53,Excellent,,,None,,,None,None,None,None,https://example.com/report.pdf,"Premium Diamond","2024-01-15","premium,round,excellent","2024-01-10",CVD`;

  // Natural Diamond template based on VDB Natural Diamond Data Instructions
  const naturalDiamondTemplate = `Stock #,Availability,Shape,Weight,Clarity,Color,Fancy Color,Fancy Color Intensity,Fancy Color Overtone,Price,Total Price,Discount Percent,Price Memo,Price Per Carat Memo,Discount Percent Memo,Image Link,Image Link 2,Image Link 3,Image Link 4,Image Link 5,Image Link 6,Video Link,Cut Grade,Polish,Symmetry,Depth Percent,Table Percent,Fluorescence Intensity,Fluorescence Color,Lab,Certificate #,Certificate Url,Cert Comment,Culet Condition,Culet Size,Girdle Percent,Girdle Condition,Girdle Thick,Girdle Thin,Measurements,Measurements Depth,Measurements Length,Measurements Width,Milky,Pavilion Depth,Treatment,BGM,Crown Height,Crown Angle,Pavilion Angle,Laser Inscription,Member Comments,Pair,H&A,Origin,Brand,City,State,Country,Stock Number for Matching Pair,Share Access,Eye Clean,Featured,Table Open,Crown Open,Girdle Open,Star Length,Type,Tinge,Luster,Black Inclusion,Location of Black,Table Inclusion,Key To Symbol,Surface Graining,Internal Graining,Inclusion Pattern,Diamond Origin Report,Short Title,Arrival Date,Tags,Certificate Updated At
ND001,Available,Round,1.2,VS2,G,,,,8500,10200,-15,9000,7500,-20,"https://example.com/diamond1.jpg","https://example.com/diamond2.jpg","https://example.com/diamond3.jpg",,,,"https://example.com/diamond-video.mp4",Excellent,Excellent,Very Good,61.8,58,Faint,Blue,GIA,2141234567,https://gia.edu/cert/2141234567,Excellent,None,None,3.2,Good,Medium,Thin,"6.8x6.9x4.2",4.2,6.8,6.9,None,43.1,None,No,15.0,34.5,40.8,GIA 2141234567,"Premium natural diamond with excellent cut and clarity",Single,None,Natural,Tiffany,"New York",NY,USA,,Yes,Yes,No,None,None,None,56,Investment Grade,None,Excellent,None,None,None,None,None,None,None,https://example.com/origin-report.pdf,"Premium Round Diamond","2024-01-15","natural,round,excellent,gia","2024-01-10"`;

  // Jewelry template based on VDB Jewelry Data Specifications
  const jewelryTemplate = `Stock Number,Jewelry Style,Jewelry Classification,Center Stone Type,Side Stone Type,Total Carat Weight,Total Price,Short Title,Comments,Metal,Mount,Total Number of Stones,Brand,Certificate Url,Center Gemstone Type,Center Stone Shape,Center Stone Color,Center Stone Clarity,Center Stone Fancy Color,Center Stone Intensity,Center Stone Fluorescence,Center Stone Lab,Center Stone Cert Number,Center Stone Enhancement,Center Stone Total Stones,Center Stone Carat Weight,Center Stone Meas Depth,Center Stone Meas Length,Center Stone Meas Width,Center Stone Polish,Center Stone Symmetry,Center Stone Cut,Center Stone Depth,Center Stone Table,Side Stone GemType,Side Stone Total Stone,Side Stone Shape,Side Stone Size,Side Stone Color,Side Stone Clarity,Side Stone FancyColorDominant Color,Side Stone FancyColor Intensity,City,State,Country,Rank,Image Link,Image Link 2,Image Link 3,Image Link 4,Image Link 5,Image Link 6,Video Link
JW001,Solitaire Engagement Ring,Natural Diamond,Natural Diamond,None,1.5,15000,"Classic Solitaire Ring","Beautiful solitaire engagement ring with natural diamond center stone",18K White Gold,Complete,1,Tiffany & Co,https://example.com/cert.pdf,Diamond,Round Brilliant,F,VS1,,Excellent,None,GIA,GIA123456,None,1,1.5,4.2,7.5,7.5,Excellent,Excellent,Excellent,62.5,57,,,,,,,,,New York,NY,USA,1,"https://example.com/ring1.jpg","https://example.com/ring2.jpg","https://example.com/ring3.jpg",,,,"https://example.com/ring-video.mp4"
JW002,Tennis Bracelet,Natural Diamond,Natural Diamond,Natural Diamond,5.0,25000,"Diamond Tennis Bracelet","Elegant tennis bracelet with natural diamonds",14K Yellow Gold,Complete,50,Cartier,,Diamond,Round Brilliant,G,VS2,,Very Good,Faint,GIA,,None,50,0.1,,,,,,,,,Diamond,50,Round,0.1,G,VS2,,,Los Angeles,CA,USA,2,"https://example.com/bracelet1.jpg","https://example.com/bracelet2.jpg",,,,,"https://example.com/bracelet-video.mp4"`;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCsvFile(null);
    setUploadResults(null);
    setNotUploadedItems([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setUploadResults(null);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const downloadTemplate = () => {
    const selectedCat = categories.find(cat => cat.id === selectedCategory);
    if (!selectedCat) return;

    let csvContent = '';
    if (selectedCategory === 'lab-grown') {
      csvContent = labGrownTemplate;
    } else if (selectedCategory === 'natural-diamonds') {
      csvContent = naturalDiamondTemplate;
    } else if (selectedCategory === 'jewelry') {
      csvContent = jewelryTemplate;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = selectedCat.templateName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    if (!csvFile || !selectedCategory) {
      toast.error('Please select a category and CSV file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('category', selectedCategory);

      const response = await productAPI.bulkUpload(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUploadResults(response.data);
      setNotUploadedItems(response.data.failedItems || []);
      
      if (response.data.successCount > 0) {
        toast.success(`Successfully uploaded ${response.data.successCount} items!`);
      }
      
      if (response.data.failedItems?.length > 0) {
        toast.warning(`${response.data.failedItems.length} items failed to upload. Check details below.`);
      }

    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeNotUploadedItem = (index) => {
    setNotUploadedItems(prev => prev.filter((_, i) => i !== index));
  };

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Product Category</h3>
        <p className="text-gray-600">Choose the type of products you want to upload in bulk</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => category.available ? handleCategorySelect(category.id) : null}
              disabled={!category.available}
              className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                category.available
                  ? 'border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transform hover:scale-105'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-full ${
                  category.available ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                }`}>
                  <IconComponent size={32} />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  {!category.available && (
                    <p className="text-xs text-red-500 mt-2">Coming Soon</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderUploadSection = () => {
    const selectedCat = categories.find(cat => cat.id === selectedCategory);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedCategory('')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedCat?.name} Bulk Upload</h3>
              <p className="text-gray-600">Upload multiple items from CSV file</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="text-blue-600 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Download Template</h4>
              <p className="text-blue-700 text-sm mt-1">
                Download the CSV template with all required fields and sample data for {selectedCat?.name}.
              </p>
              <button
                onClick={downloadTemplate}
                className="mt-3 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Download size={16} />
                <span>Download {selectedCat?.templateName}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Jewelry-specific guide */}
        {selectedCategory === 'jewelry' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Jewelry Upload Guide</h4>
              <button
                onClick={() => setShowJewelryGuide(!showJewelryGuide)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showJewelryGuide ? 'Hide Guide' : 'Show Detailed Guide'}
              </button>
            </div>
            
            {showJewelryGuide && (
              <JewelryBulkUploadGuide onDownloadTemplate={downloadTemplate} />
            )}
            
            {!showJewelryGuide && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h5 className="font-semibold text-amber-900 mb-2">Quick Jewelry Upload Tips</h5>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• <strong>Stock Number:</strong> Must be unique (e.g., JW001, RING-2024-001)</li>
                  <li>• <strong>Jewelry Style:</strong> Must match exactly (e.g., "Solitaire Engagement Ring")</li>
                  <li>• <strong>Classification:</strong> Natural Diamond, Lab-Grown Diamond, or Other</li>
                  <li>• <strong>Image Link:</strong> Required - must be a valid, accessible URL</li>
                  <li>• Click "Show Detailed Guide" above for complete field specifications</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-900">Upload CSV File</h4>
              <p className="text-gray-600">Select your completed CSV file to upload</p>
            </div>
            
            <div className="mt-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose CSV File
              </label>
            </div>
            
            {csvFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-green-800 font-medium">{csvFile.name}</span>
                  <button
                    onClick={() => setCsvFile(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {csvFile && (
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Start Bulk Upload
                </>
              )}
            </button>
          </div>
        )}

        {uploading && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {uploadResults && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="font-semibold text-green-900">{uploadResults.successCount}</p>
                    <p className="text-sm text-green-700">Successfully Uploaded</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <div>
                    <p className="font-semibold text-red-900">{uploadResults.failedCount}</p>
                    <p className="text-sm text-red-700">Failed to Upload</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="text-blue-600" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900">{uploadResults.totalItems}</p>
                    <p className="text-sm text-blue-700">Total Items Processed</p>
                  </div>
                </div>
              </div>
            </div>

            {notUploadedItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">Items Not Uploaded</h5>
                  <button
                    onClick={() => setShowNotUploaded(!showNotUploaded)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showNotUploaded ? 'Hide' : 'Show'} Details
                  </button>
                </div>

                {showNotUploaded && (
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-2">Stock #</div>
                        <div className="col-span-7">Error</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notUploadedItems.map((item, index) => (
                        <div key={index} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-2">
                              <span className="text-sm font-medium text-gray-900">
                                {item.stockNumber || `Row ${item.rowIndex}`}
                              </span>
                            </div>
                            <div className="col-span-7">
                              <span className="text-sm text-red-600">{item.error}</span>
                            </div>
                            <div className="col-span-2">
                              <button
                                onClick={() => removeNotUploadedItem(index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Remove from list"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bulk Upload Products</h2>
        <p className="text-blue-100">
          Upload multiple products at once using CSV files. Download templates and follow the format for seamless uploads.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        {!selectedCategory ? renderCategorySelection() : renderUploadSection()}
      </div>
    </div>
  );
};

export default BulkUpload; 