import PropertyPage from './page-fixed';

// Export the fixed implementation to replace the original page
export default PropertyPage;

// Re-export the generateMetadata function from the fixed implementation
export { generateMetadata } from './page-fixed';
