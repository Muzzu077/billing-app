const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

class DBService {
  constructor() {
    this.pool = null;
  }

  connect() {
    try {
      const connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        console.log('⚠️  DATABASE_URL not found. Please set DATABASE_URL in your .env file');
        return;
      }

      this.pool = new Pool({
        connectionString: connectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        max: 5,
      });


      console.log('✅ PostgreSQL connected successfully');

      // Test connection
      this.pool.query('SELECT NOW()', (err, res) => {
        if (err) {
          console.error('❌ Failed to verify database connection:', err.message);
        } else {
          console.log('✅ Database connection verified');
        }
      });

    } catch (error) {
      console.error('❌ Failed to initialize Database:', error.message);
    }
  }

  getPool() {

    if (!this.pool) {
      this.connect();
    }
    return this.pool;
  }

  // Helpers to map DB rows to frontend-friendly shapes
  mapAdminRow(db) {
    if (!db) return null;
    return {
      id: db.id,
      username: db.username,
      display_name: db.display_name,
      price_multiplier: Number(db.price_multiplier),
      password_hash: db.password, // map 'password' in DB to password_hash for frontend compatibility if needed
    };
  }

  mapBrandRow(db) {
    if (!db) return null;
    return {
      id: db.id,
      name: db.name,
      logo: db.logo,
      tagline: db.tagline,
      category: db.category,
      is_active: db.is_active,
      created_at: db.created_at,
      updated_at: db.updated_at,
    };
  }

  mapProductRow(db) {
    if (!db) return null;
    return {
      id: db.id,
      description: db.description,
      brand_id: db.brand_id,
      list_price: Number(db.list_price),
      coil_price: Number(db.coil_price),
      is_active: db.is_active,
      created_at: db.created_at,
      updated_at: db.updated_at,
      // Embedded brand if joined
      brands: db.brand_name ? { id: db.brand_id, name: db.brand_name } : undefined,
    };
  }

  mapQuotationRowToFrontend(db) {
    if (!db) return null;
    return {
      _id: db.id, // frontend expects _id
      id: db.id,
      brand: db.brand,
      customerName: db.customername,
      date: db.date,
      products: db.products, // is already parsed JSON with pg JSONB
      subtotal: Number(db.subtotal),
      gst: Number(db.gst),
      total: Number(db.total),
      paid: db.paid,
      terms: db.terms,
      contactInfo: db.contactinfo,
      createdAt: db.createdat,
      updatedAt: db.updatedat,
    };
  }

  // Admin operations
  async createAdmin(username, password, displayName = username, priceMultiplier = 1) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO admins (username, password, display_name, price_multiplier)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [username, passwordHash, displayName, priceMultiplier];
      
      const { rows } = await this.getPool().query(query, values);
      return this.mapAdminRow(rows[0]);
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async getAdmin(username) {
    try {
      const query = 'SELECT * FROM admins WHERE username = $1';
      const { rows } = await this.getPool().query(query, [username]);
      return this.mapAdminRow(rows[0]);
    } catch (error) {
      console.error('Error getting admin:', error);
      return null;
    }
  }

  async verifyAdminPassword(username, password) {
    try {
      const admin = await this.getAdmin(username);
      if (!admin) return false;
      
      const hash = admin.password_hash || admin.password; // Check mapped or raw
      // Wait, mapAdminRow maps 'password' to 'password_hash' or leaves it.
      // In mapAdminRow I did `password_hash: db.password`.
      return await bcrypt.compare(password, admin.password_hash);
    } catch (error) {
      console.error('Error verifying admin password:', error);
      return false;
    }
  }

  // Brand operations
  async createBrand(brandData) {
    try {
      const query = `
        INSERT INTO brands (name, logo, tagline, category, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        brandData.name,
        brandData.logo,
        brandData.tagline,
        brandData.category,
        brandData.is_active ?? true
      ];

      const { rows } = await this.getPool().query(query, values);
      return this.mapBrandRow(rows[0]);
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }

  async getAllBrands() {
    try {
      const query = 'SELECT * FROM brands WHERE is_active = true ORDER BY name';
      const { rows } = await this.getPool().query(query);
      return rows.map((b) => this.mapBrandRow(b));
    } catch (error) {
      console.error('Error getting brands:', error);
      return [];
    }
  }

  async getBrandById(id) {
    try {
      const query = 'SELECT * FROM brands WHERE id = $1';
      const { rows } = await this.getPool().query(query, [id]);
      return this.mapBrandRow(rows[0]);
    } catch (error) {
      console.error('Error getting brand:', error);
      return null;
    }
  }

  async updateBrand(id, updateData) {
    try {
      const allowedFields = ['name', 'logo', 'tagline', 'category', 'is_active'];
      const fields = Object.keys(updateData).filter(f => allowedFields.includes(f));
      const values = fields.map(f => updateData[f]);
      if (fields.length === 0) throw new Error('No valid fields to update');
      const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      values.push(id);

      const query = `UPDATE brands SET ${setClause}, updated_at = now() WHERE id = $${values.length} RETURNING *`;
      const { rows } = await this.getPool().query(query, values);
      return this.mapBrandRow(rows[0]);
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  }

  async deleteBrand(id) {
    try {
      const query = 'UPDATE brands SET is_active = false, updated_at = now() WHERE id = $1';
      await this.getPool().query(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }

  // Product operations
  async createProduct(productData) {
    try {
      const query = `
        INSERT INTO products (brand_id, description, list_price, coil_price, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        productData.brand_id,
        productData.description,
        productData.list_price,
        productData.coil_price,
        productData.is_active ?? true
      ];

      const { rows } = await this.getPool().query(query, values);
      // Fetch joint details
      return this.getProductById(rows[0].id);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const query = `
        SELECT p.*, b.name as brand_name 
        FROM products p 
        LEFT JOIN brands b ON p.brand_id = b.id 
        WHERE p.is_active = true 
        ORDER BY p.description
      `;
      const { rows } = await this.getPool().query(query);
      return rows.map((p) => this.mapProductRow(p));
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async getProductsByBrand(brandId) {
    try {
      const query = `
        SELECT p.*, b.name as brand_name 
        FROM products p 
        LEFT JOIN brands b ON p.brand_id = b.id 
        WHERE p.brand_id = $1 AND p.is_active = true 
        ORDER BY p.description
      `;
      const { rows } = await this.getPool().query(query, [brandId]);
      return rows.map((p) => this.mapProductRow(p));
    } catch (error) {
      console.error('Error getting products by brand:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const query = `
        SELECT p.*, b.name as brand_name 
        FROM products p 
        LEFT JOIN brands b ON p.brand_id = b.id 
        WHERE p.id = $1
      `;
      const { rows } = await this.getPool().query(query, [id]);
      return this.mapProductRow(rows[0]);
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const allowedFields = ['brand_id', 'description', 'list_price', 'coil_price', 'is_active'];
      const fields = Object.keys(updateData).filter(f => allowedFields.includes(f));
      const values = fields.map(f => updateData[f]);
      if (fields.length === 0) throw new Error('No valid fields to update');
      const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      values.push(id);

      const query = `UPDATE products SET ${setClause}, updated_at = now() WHERE id = $${values.length} RETURNING *`;
      await this.getPool().query(query, values);
      return this.getProductById(id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const query = 'UPDATE products SET is_active = false, updated_at = now() WHERE id = $1';
      await this.getPool().query(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Quotation operations
  async createQuotation(quotationData) {
    try {
      const query = `
        INSERT INTO quotations (brand, customername, date, products, subtotal, gst, total, paid)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        quotationData.brand,
        quotationData.customerName,
        quotationData.date,
        JSON.stringify(quotationData.products), // Ensure JSONB is passed as string or let pg handle it if it handles object (pg handles objects! but string is safer)
        quotationData.subtotal,
        quotationData.gst,
        quotationData.total,
        quotationData.paid ?? false
      ];

      const { rows } = await this.getPool().query(query, values);
      return this.mapQuotationRowToFrontend(rows[0]);
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  }

  async getAllQuotations() {
    try {
      const query = 'SELECT * FROM quotations ORDER BY createdat DESC';
      const { rows } = await this.getPool().query(query);
      return rows.map((q) => this.mapQuotationRowToFrontend(q));
    } catch (error) {
      console.error('Error getting quotations:', error);
      return [];
    }
  }

  async getQuotationById(id) {
    try {
      const query = 'SELECT * FROM quotations WHERE id = $1';
      const { rows } = await this.getPool().query(query, [id]);
      return this.mapQuotationRowToFrontend(rows[0]);
    } catch (error) {
      console.error('Error getting quotation:', error);
      return null;
    }
  }

  async updateQuotation(id, updateData) {
    try {
      // Map possible camelCase fields to snake_case
      const mapped = { ...updateData };
      if (mapped.customerName) { mapped.customername = mapped.customerName; delete mapped.customerName; }
      if (mapped.contactInfo) { mapped.contactinfo = mapped.contactInfo; delete mapped.contactInfo; }
      
      const allowedFields = ['brand', 'customername', 'date', 'products', 'subtotal', 'gst', 'total', 'paid', 'terms', 'contactinfo'];
      const fields = Object.keys(mapped).filter(f => allowedFields.includes(f));
      const values = fields.map(f => typeof mapped[f] === 'object' ? JSON.stringify(mapped[f]) : mapped[f]);
      if (fields.length === 0) throw new Error('No valid fields to update');
      const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      values.push(id);

      const query = `UPDATE quotations SET ${setClause}, updatedat = now() WHERE id = $${values.length} RETURNING *`;
      const { rows } = await this.getPool().query(query, values);
      return this.mapQuotationRowToFrontend(rows[0]);
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  }

  async deleteQuotation(id) {
    try {
      const query = 'DELETE FROM quotations WHERE id = $1';
      await this.getPool().query(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  }
}

module.exports = new DBService();
