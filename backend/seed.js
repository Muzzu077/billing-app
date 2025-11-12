const supabaseService = require('./services/supabaseService');
require('dotenv').config();

// Initialize Supabase service
supabaseService.initializeSupabase();

// Sample brands data
const brandsData = [
  {
    name: 'Havells',
    tagline: 'powering lives',
    category: 'HR-FR',
    is_active: true
  },
  {
    name: 'Finolex',
    tagline: 'trusted for generations',
    category: 'FR-LSZH',
    is_active: true
  },
  {
    name: 'GM',
    tagline: 'quality wires',
    category: 'HR-FR',
    is_active: true
  },
  {
    name: 'Polycab',
    tagline: 'trusted by millions',
    category: 'HR-FR',
    is_active: true
  },
  {
    name: 'Goldmedal',
    tagline: 'excellence in wiring',
    category: 'HR-FR',
    is_active: true
  },
  {
    name: 'Apar',
    tagline: 'reliable solutions',
    category: 'HR-FR',
    is_active: true
  },
  {
    name: 'V-Guard',
    tagline: 'protecting what matters',
    category: 'HR-FR',
    is_active: true
  }
];

// Sample products data
const productsData = [
  {
    description: '1.0 Sqmm 90 Mtrs',
    listPrice: 2010,
    coilPrice: 1328
  },
  {
    description: '1.5 Sqmm 90 Mtrs',
    listPrice: 3020,
    coilPrice: 1996
  },
  {
    description: '2.5 Sqmm 90 Mtrs',
    listPrice: 4695,
    coilPrice: 3102
  },
  {
    description: '4.0 Sqmm 90 Mtrs',
    listPrice: 6875,
    coilPrice: 4543
  },
  {
    description: '6.0 Sqmm 90 Mtrs',
    listPrice: 10250,
    coilPrice: 6780
  },
  {
    description: '10.0 Sqmm 90 Mtrs',
    listPrice: 16800,
    coilPrice: 11100
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Wait for Supabase to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Clear existing data (we'll need to implement this in supabaseService)
    console.log('Clearing existing data...');
    
    // Insert brands
    console.log('Inserting brands...');
    const insertedBrands = [];
    for (const brandData of brandsData) {
      try {
        const brand = await supabaseService.createBrand(brandData);
        insertedBrands.push(brand);
        console.log(`Inserted brand: ${brand.name}`);
      } catch (error) {
        console.error(`Error inserting brand ${brandData.name}:`, error.message);
      }
    }
    
    console.log(`Inserted ${insertedBrands.length} brands`);

    // Insert products for each brand
    console.log('Inserting products...');
    let totalProducts = 0;
    for (const brand of insertedBrands) {
      for (const productData of productsData) {
        try {
          await supabaseService.createProduct({
            brand_id: brand.id,
            description: productData.description,
            list_price: productData.listPrice,
            coil_price: productData.coilPrice,
            is_active: true
          });
          totalProducts++;
        } catch (error) {
          console.error(`Error inserting product for ${brand.name}:`, error.message);
        }
      }
      console.log(`Inserted products for ${brand.name}`);
    }

    console.log(`Inserted ${totalProducts} products`);
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();