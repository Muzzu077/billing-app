const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

class SupabaseService {
  constructor() {
    this.supabase = null;
  }

  initializeSupabase() {
    if (this.supabase) return this.supabase;

    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !serviceKey) {
        console.warn(
          '⚠️  Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file'
        );
        return null;
      }

      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn(
          'ℹ️  Falling back to SUPABASE_ANON_KEY. For write operations, prefer SUPABASE_SERVICE_ROLE_KEY.'
        );
      }

      this.supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false },
      });
      console.log('✅ Supabase service initialized successfully');
      return this.supabase;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase:', error.message);
      return null;
    }
  }

  getClient() {
    const client = this.initializeSupabase();
    if (!client) {
      throw new Error('Supabase not initialized. Check your environment variables.');
    }
    return client;
  }

  // Helpers to map DB rows to frontend-friendly shapes
  mapAdminRow(db) {
    if (!db) return null;
    return {
      id: db.id,
      username: db.username,
      display_name: db.display_name,
      price_multiplier: db.price_multiplier,
      password_hash: db.password_hash || db.password,
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
      list_price: db.list_price,
      coil_price: db.coil_price,
      is_active: db.is_active,
      created_at: db.created_at,
      updated_at: db.updated_at,
      // Embedded brand if joined
      brands: db.brands ? { id: db.brands.id, name: db.brands.name } : undefined,
    };
  }

  mapQuotationRowToFrontend(db) {
    if (!db) return null;
    return {
      _id: db.id, // frontend expects _id
      id: db.id,
      brand: db.brand,
      customerName: db.customer_name ?? db.customername ?? db.customerName,
      date: db.date,
      products: db.products,
      subtotal: Number(db.subtotal),
      gst: Number(db.gst),
      total: Number(db.total),
      paid: db.paid,
      terms: db.terms,
      contactInfo: db.contact_info ?? db.contactinfo ?? db.contactInfo,
      createdAt: db.created_at ?? db.createdat ?? db.createdAt,
      updatedAt: db.updated_at ?? db.updatedat ?? db.updatedAt,
    };
  }

  // Admin operations
  async createAdmin(username, password, displayName = username, priceMultiplier = 1) {
    try {
      const supabase = this.getClient();

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const { data, error } = await supabase
        .from('admins')
        .insert([
          {
            username,
            password: passwordHash,
            display_name: displayName,
            price_multiplier: priceMultiplier
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapAdminRow(data);
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async getAdmin(username) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return this.mapAdminRow(data);
    } catch (error) {
      console.error('Error getting admin:', error);
      return null;
    }
  }

  async verifyAdminPassword(username, password) {
    try {
      const admin = await this.getAdmin(username);
      if (!admin) return false;
      
      return await bcrypt.compare(password, admin.password_hash);
    } catch (error) {
      console.error('Error verifying admin password:', error);
      return false;
    }
  }

  // Brand operations
  async createBrand(brandData) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('brands')
        .insert([brandData])
        .select()
        .single();

      if (error) throw error;
      return this.mapBrandRow(data);
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }

  async getAllBrands() {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data || []).map((b) => this.mapBrandRow(b));
    } catch (error) {
      console.error('Error getting brands:', error);
      return [];
    }
  }

  async getBrandById(id) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return this.mapBrandRow(data);
    } catch (error) {
      console.error('Error getting brand:', error);
      return null;
    }
  }

  async updateBrand(id, updateData) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('brands')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapBrandRow(data);
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  }

  async deleteBrand(id) {
    try {
      const supabase = this.getClient();

      const { error } = await supabase
        .from('brands')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }

  // Product operations
  async createProduct(productData) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(`
          *,
          brands (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;
      return this.mapProductRow(data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands (
            id,
            name
          )
        `)
        .eq('is_active', true)
        .order('description');

      if (error) throw error;
      return (data || []).map((p) => this.mapProductRow(p));
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async getProductsByBrand(brandId) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('description');

      if (error) throw error;
      return (data || []).map((p) => this.mapProductRow(p));
    } catch (error) {
      console.error('Error getting products by brand:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return this.mapProductRow(data);
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          brands (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;
      return this.mapProductRow(data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const supabase = this.getClient();

      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Quotation operations
  async createQuotation(quotationData) {
    try {
      const supabase = this.getClient();

      // Map frontend camelCase to DB snake_case
      const payload = {
        brand: quotationData.brand,
        customername: quotationData.customerName,
        date: quotationData.date,
        products: quotationData.products,
        subtotal: quotationData.subtotal,
        gst: quotationData.gst,
        total: quotationData.total,
        paid: quotationData.paid ?? false,
      };

      const { data, error } = await supabase
        .from('quotations')
        .insert([payload])
        .select('*')
        .single();

      if (error) throw error;
      return this.mapQuotationRowToFrontend(data);
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  }

  async getAllQuotations() {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('createdat', { ascending: false });

      if (error) throw error;
      return (data || []).map((q) => this.mapQuotationRowToFrontend(q));
    } catch (error) {
      console.error('Error getting quotations:', error);
      return [];
    }
  }

  async getQuotationById(id) {
    try {
      const supabase = this.getClient();

      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return this.mapQuotationRowToFrontend(data);
    } catch (error) {
      console.error('Error getting quotation:', error);
      return null;
    }
  }

  async updateQuotation(id, updateData) {
    try {
      const supabase = this.getClient();

      // Map possible camelCase fields to snake_case
      const mapped = { ...updateData };
      if (Object.prototype.hasOwnProperty.call(mapped, 'customerName')) {
        mapped.customername = mapped.customerName;
        delete mapped.customerName;
      }
      if (Object.prototype.hasOwnProperty.call(mapped, 'contactInfo')) {
        mapped.contactinfo = mapped.contactInfo;
        delete mapped.contactInfo;
      }
      if (Object.prototype.hasOwnProperty.call(mapped, 'createdAt')) {
        mapped.createdat = mapped.createdAt;
        delete mapped.createdAt;
      }
      if (Object.prototype.hasOwnProperty.call(mapped, 'updatedAt')) {
        mapped.updatedat = mapped.updatedAt;
        delete mapped.updatedAt;
      }

      const { data, error } = await supabase
        .from('quotations')
        .update(mapped)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return this.mapQuotationRowToFrontend(data);
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  }

  async deleteQuotation(id) {
    try {
      const supabase = this.getClient();

      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  }
}

module.exports = new SupabaseService();
