/**
 * Utility functions for consistent price formatting in USD
 */

/**
 * Format price in USD with proper locale formatting
 * @param {number} price - The price to format
 * @param {boolean} showCurrency - Whether to show the currency symbol (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, showCurrency = true) => {
  if (!price || isNaN(price)) return showCurrency ? '$0' : '0';
  
  const formattedNumber = price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return showCurrency ? `$${formattedNumber}` : formattedNumber;
};

/**
 * Format price per carat in USD
 * @param {number} pricePerCarat - The price per carat to format
 * @returns {string} Formatted price per carat string
 */
export const formatPricePerCarat = (pricePerCarat) => {
  if (!pricePerCarat || isNaN(pricePerCarat)) return '$0/ct';
  
  const formattedNumber = pricePerCarat.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return `$${formattedNumber}/ct`;
};

/**
 * Format price range for display
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range string
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return 'Price not available';
  if (!maxPrice) return `From ${formatPrice(minPrice)}`;
  if (!minPrice) return `Up to ${formatPrice(maxPrice)}`;
  
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

/**
 * Parse price string to number (removes currency symbols and commas)
 * @param {string} priceString - Price string to parse
 * @returns {number} Parsed price number
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  
  // Remove currency symbols, commas, and spaces
  const cleanString = priceString.toString().replace(/[$,\s₹]/g, '');
  const parsed = parseFloat(cleanString);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Budget ranges in USD for appointment booking
 */
export const BUDGET_RANGES = [
  { value: '0', label: 'Under $5,000' },
  { value: '5000', label: '$5,000 - $10,000' },
  { value: '10000', label: '$10,000 - $25,000' },
  { value: '25000', label: '$25,000 - $50,000' },
  { value: '50000', label: 'Above $50,000' }
];

/**
 * Format budget range for display
 * @param {string|number} budgetValue - Budget value
 * @returns {string} Formatted budget range
 */
export const formatBudgetRange = (budgetValue) => {
  const budget = BUDGET_RANGES.find(range => range.value === budgetValue?.toString());
  return budget ? budget.label : 'Not specified';
}; 