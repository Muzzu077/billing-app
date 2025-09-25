# Electrical Business Quotation Generator

A full-stack React application with MongoDB backend for generating professional quotations for electrical wire products. The app supports multiple brands like Havells, Finolex, GM, Polycab, Goldmedal, Apar, and V-Guard.

## Features

- **Professional Quotation Generation**: Create quotations that match the Havells format with red headers, blue sub-headers, and yellow total highlighting
- **Multi-Brand Support**: Manage multiple electrical brands with custom logos and branding
- **Product Management**: Add and manage wire products with list prices and coil prices
- **PDF Export**: Generate professional PDF quotations using html2pdf.js
- **Quotation History**: View, search, and manage all generated quotations
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **MongoDB Backend**: Robust data storage with MongoDB and Mongoose

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Hot Toast for notifications
- html2pdf.js for PDF generation
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- CORS enabled

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd billing-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cd ../backend
   cp env.example .env
   
   # Edit .env with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/billing-app
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud service)

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Or run both simultaneously**
   ```bash
   # From the root directory
   npm run dev
   ```

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend
   npm start
   ```

## Adding Brand Logos

To add logos for your brands:

1. Place your logo images in the `backend/uploads/logos/` directory
2. The logos will be automatically served from `/uploads/logos/` endpoint
3. When creating a brand in the admin panel, you can upload the logo file

**Supported formats**: JPG, PNG, GIF, SVG

## Usage

### 1. Setting Up Brands
- Go to the Admin panel
- Add your electrical brands (Havells, Finolex, etc.)
- Upload brand logos
- Set brand taglines and categories

### 2. Adding Products
- In the Admin panel, switch to the Products tab
- Add wire products with descriptions, list prices, and coil prices
- Associate products with specific brands

### 3. Creating Quotations
- Navigate to "Create Quotation"
- Select a brand from the dropdown
- Enter customer information
- Add products to the quotation table
- The system automatically calculates totals and GST
- Customize terms and conditions
- Export as PDF or save the quotation

### 4. Managing History
- View all generated quotations in the History page
- Search and filter quotations by customer or brand
- View detailed quotation information
- Export existing quotations as PDF
- Delete quotations if needed

## API Endpoints

### Quotations
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/:id` - Get single quotation
- `POST /api/quotations` - Create new quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation

### Brands
- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get single brand
- `POST /api/brands` - Create new brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

### Products
- `GET /api/products` - Get all products
- `GET /api/products/brand/:brandId` - Get products by brand
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Deployment

### Local Production
1. Build the frontend: `cd frontend && npm run build`
2. Start the backend: `cd backend && npm start`
3. The app will serve the built frontend from the backend

### Cloud Deployment (Heroku, Railway, etc.)
1. Set up your MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy the backend
4. The frontend will be served by the backend in production

### Environment Variables for Production
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
```

## File Structure

```
billing-app/
├── backend/
│   ├── models/
│   │   ├── Quotation.js
│   │   ├── Brand.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── quotations.js
│   │   ├── brands.js
│   │   └── products.js
│   ├── uploads/
│   │   └── logos/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuotationForm.jsx
│   │   │   ├── QuotationTable.jsx
│   │   │   ├── TermsSection.jsx
│   │   │   └── PDFExport.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CreateQuotation.jsx
│   │   │   ├── History.jsx
│   │   │   └── Admin.jsx
│   │   ├── context/
│   │   │   ├── BrandContext.jsx
│   │   │   └── QuotationContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 