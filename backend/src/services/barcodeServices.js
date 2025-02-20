import { get } from 'axios';

const UPC_API_URL = 'https://api.upcitemdb.com/prod/trial/lookup'; // Replace with actual API if needed
const UPC_API_KEY = process.env.UPC_API_KEY; // Store API key securely

async function fetchProductByBarcode(barcode) {
    try {
        const response = await get(UPC_API_URL, {
            params: { upc: barcode },
            headers: { 'Authorization': `Bearer ${UPC_API_KEY}` }
        });

        const items = response.data.items;
        if (items && items.length > 0) {
            const item = items[0];
            return {
                name: item.title,
                category: item.category || 'Others',
                price: item.lowest_recorded_price || 0
            };
        } else {
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error(`Error fetching product by barcode: ${error.message}`);
        throw error;
    }
}

export default { fetchProductByBarcode };