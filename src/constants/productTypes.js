/**
 * =====================================================
 * PRODUCT TYPE & CATEGORY CONSTANTS
 * =====================================================
 * 
 * Centralized constants for product types and categories
 * to ensure consistency across the entire application.
 * 
 * Usage:
 * import { PRODUCT_TYPES, JEWELRY_CATEGORIES, ... } from '@/constants/productTypes';
 */

// ==============================================
// PRODUCT TYPES (used in Product.productType)
// ==============================================
export const PRODUCT_TYPES = {
  DIAMOND: 'diamond',
  RING: 'ring',
  JEWELRY: 'jewelry',
  LAB_GROWN: 'lab-grown',
  NATURAL_DIAMOND: 'natural-diamond'
};

// Array of all valid product types
export const ALL_PRODUCT_TYPES = Object.values(PRODUCT_TYPES);

// ==============================================
// JEWELRY CATEGORIES (used in jewelrySpecs.jewelryCategory)
// ==============================================
export const JEWELRY_CATEGORIES = {
  RING: 'Ring',
  BAND: 'Band',
  EARRINGS: 'Earrings',
  NECKLACE: 'Necklace',
  BRACELET: 'Bracelet',
  PENDANT: 'Pendant',
  TENNIS_BRACELET: 'Tennis Bracelet',
  ETERNITY_BAND: 'Eternity Band'
};

// Array of all jewelry categories
export const ALL_JEWELRY_CATEGORIES = Object.values(JEWELRY_CATEGORIES);

// Jewelry categories with labels for UI
export const JEWELRY_CATEGORY_OPTIONS = [
  { value: 'Ring', label: 'Ring' },
  { value: 'Band', label: 'Band' },
  { value: 'Earrings', label: 'Earrings' },
  { value: 'Necklace', label: 'Necklace' },
  { value: 'Bracelet', label: 'Bracelet' },
  { value: 'Pendant', label: 'Pendant' },
  { value: 'Tennis Bracelet', label: 'Tennis Bracelet' },
  { value: 'Eternity Band', label: 'Eternity Band' }
];

// ==============================================
// JEWELRY SUB-CATEGORIES
// ==============================================
export const JEWELRY_SUB_CATEGORIES = {
  // Ring sub-categories
  SOLITAIRE: 'Solitaire',
  HALO: 'Halo',
  THREE_STONE: 'Three Stone',
  SIDE_STONE: 'Side Stone',
  VINTAGE: 'Vintage',
  CLASSIC: 'Classic',
  MODERN: 'Modern',
  
  // Earring sub-categories
  STUD: 'Stud',
  DROP: 'Drop',
  HUGGIE: 'Huggie',
  HOOP: 'Hoop',
  
  // Other
  CHAIN: 'Chain',
  TENNIS: 'Tennis'
};

export const JEWELRY_SUB_CATEGORY_OPTIONS = [
  { value: 'Solitaire', label: 'Solitaire' },
  { value: 'Halo', label: 'Halo' },
  { value: 'Three Stone', label: 'Three Stone' },
  { value: 'Side Stone', label: 'Side Stone' },
  { value: 'Vintage', label: 'Vintage' },
  { value: 'Classic', label: 'Classic' },
  { value: 'Modern', label: 'Modern' },
  { value: 'Stud', label: 'Stud' },
  { value: 'Drop', label: 'Drop' },
  { value: 'Huggie', label: 'Huggie' },
  { value: 'Hoop', label: 'Hoop' },
  { value: 'Chain', label: 'Chain' },
  { value: 'Tennis', label: 'Tennis' }
];

// ==============================================
// JEWELRY CLASSIFICATIONS
// ==============================================
export const JEWELRY_CLASSIFICATIONS = {
  NATURAL_DIAMOND: 'Natural Diamond',
  LAB_GROWN_DIAMOND: 'Lab Grown Diamond',
  PRECIOUS_METAL: 'Precious Metal',
  GEMSTONE: 'Gemstone',
  OTHER: 'Other'
};

export const JEWELRY_CLASSIFICATION_OPTIONS = [
  { value: 'Natural Diamond', label: 'Natural Diamond' },
  { value: 'Lab Grown Diamond', label: 'Lab Grown Diamond' },
  { value: 'Precious Metal', label: 'Precious Metal' },
  { value: 'Gemstone', label: 'Gemstone' },
  { value: 'Other', label: 'Other' }
];

// ==============================================
// URL MAPPINGS (for SEO-friendly URLs)
// ==============================================
export const CATEGORY_URL_MAPPING = {
  'ring': 'Ring',
  'rings': 'Ring',
  'engagement': 'Ring', // Legacy support
  'band': 'Band',
  'bands': 'Band',
  'wedding': 'Band', // Legacy support
  'earrings': 'Earrings',
  'earring': 'Earrings',
  'necklace': 'Necklace',
  'necklaces': 'Necklace',
  'bracelet': 'Bracelet',
  'bracelets': 'Bracelet',
  'pendant': 'Pendant',
  'pendants': 'Pendant',
  'tennis-bracelet': 'Tennis Bracelet',
  'eternity-band': 'Eternity Band'
};

export const CATEGORY_TO_URL_MAPPING = {
  'Ring': 'ring',
  'Band': 'band',
  'Earrings': 'earrings',
  'Necklace': 'necklace',
  'Bracelet': 'bracelet',
  'Pendant': 'pendant',
  'Tennis Bracelet': 'tennis-bracelet',
  'Eternity Band': 'eternity-band'
};

// ==============================================
// LEGACY MAPPINGS (for backward compatibility)
// ==============================================
// Maps old category names to new standardized names
export const LEGACY_CATEGORY_MAPPING = {
  'Engagement Ring': 'Ring',
  'Wedding Band': 'Band',
  'Engagement Rings': 'Ring',
  'Wedding Bands': 'Band'
};

// Function to normalize category names (handles legacy values)
export const normalizeCategory = (category) => {
  if (!category) return '';
  const trimmed = category.trim();
  return LEGACY_CATEGORY_MAPPING[trimmed] || trimmed;
};

// ==============================================
// METALS
// ==============================================
export const METALS = {
  PLATINUM: 'Platinum',
  WHITE_GOLD_14K: '14K White Gold',
  WHITE_GOLD_18K: '18K White Gold',
  YELLOW_GOLD_14K: '14K Yellow Gold',
  YELLOW_GOLD_18K: '18K Yellow Gold',
  ROSE_GOLD_14K: '14K Rose Gold',
  ROSE_GOLD_18K: '18K Rose Gold',
  SILVER: 'Silver'
};

export const METAL_OPTIONS = [
  { value: '14K White Gold', label: '14K White Gold' },
  { value: '18K White Gold', label: '18K White Gold' },
  { value: '14K Yellow Gold', label: '14K Yellow Gold' },
  { value: '18K Yellow Gold', label: '18K Yellow Gold' },
  { value: '14K Rose Gold', label: '14K Rose Gold' },
  { value: '18K Rose Gold', label: '18K Rose Gold' },
  { value: 'Platinum', label: 'Platinum' },
  { value: 'Silver', label: 'Silver' }
];

// ==============================================
// DIAMOND PROPERTIES
// ==============================================
export const DIAMOND_SHAPES = [
  'Round', 'Princess', 'Emerald', 'Asscher', 'Marquise', 
  'Oval', 'Radiant', 'Pear', 'Heart', 'Cushion'
];

export const DIAMOND_COLORS = [
  'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
];

export const DIAMOND_CLARITIES = [
  'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'
];

export const DIAMOND_CUTS = [
  'Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'
];

export const DIAMOND_LABS = [
  'GIA', 'AGS', 'IGI', 'GCAL', 'EGL', 'GSI'
];

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Get display label for a product type
 */
export const getProductTypeLabel = (productType) => {
  const labels = {
    [PRODUCT_TYPES.DIAMOND]: 'Diamond',
    [PRODUCT_TYPES.RING]: 'Ring',
    [PRODUCT_TYPES.JEWELRY]: 'Jewelry',
    [PRODUCT_TYPES.LAB_GROWN]: 'Lab-Grown Diamond',
    [PRODUCT_TYPES.NATURAL_DIAMOND]: 'Natural Diamond'
  };
  return labels[productType] || productType;
};

/**
 * Get URL path for a product type
 */
export const getProductTypePath = (productType) => {
  const paths = {
    [PRODUCT_TYPES.DIAMOND]: '/diamonds',
    [PRODUCT_TYPES.RING]: '/jewelry?category=ring',
    [PRODUCT_TYPES.JEWELRY]: '/jewelry',
    [PRODUCT_TYPES.LAB_GROWN]: '/diamonds',
    [PRODUCT_TYPES.NATURAL_DIAMOND]: '/diamonds'
  };
  return paths[productType] || '/jewelry';
};

/**
 * Check if a product type is a diamond type
 */
export const isDiamondType = (productType) => {
  return [
    PRODUCT_TYPES.DIAMOND,
    PRODUCT_TYPES.LAB_GROWN,
    PRODUCT_TYPES.NATURAL_DIAMOND
  ].includes(productType);
};

/**
 * Check if a product type is a jewelry/ring type
 */
export const isJewelryType = (productType) => {
  return [
    PRODUCT_TYPES.JEWELRY,
    PRODUCT_TYPES.RING
  ].includes(productType);
};

export default {
  PRODUCT_TYPES,
  JEWELRY_CATEGORIES,
  JEWELRY_SUB_CATEGORIES,
  JEWELRY_CLASSIFICATIONS,
  CATEGORY_URL_MAPPING,
  CATEGORY_TO_URL_MAPPING,
  LEGACY_CATEGORY_MAPPING,
  normalizeCategory,
  getProductTypeLabel,
  getProductTypePath,
  isDiamondType,
  isJewelryType
};

