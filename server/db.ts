import { createClient, SupabaseClient } from '@supabase/supabase-js';
import configManager, { getConfig } from './config';

// Supabase clients - will be initialized after config is loaded
let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

// Initialize database clients after configuration is loaded
export async function initializeDatabase() {
  // Ensure configuration is initialized
  await configManager.initialize();
  
  // Get configuration values
  const SUPABASE_URL = configManager.get('SUPABASE_URL');
  const SUPABASE_ANON_KEY = configManager.get('SUPABASE_ANON_KEY');
  const SUPABASE_SERVICE_ROLE_KEY = configManager.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!SUPABASE_URL) {
    console.error('SUPABASE_URL not configured');
    throw new Error('Database URL is not configured');
  }
  
  if (!SUPABASE_ANON_KEY) {
    console.error('SUPABASE_ANON_KEY not configured');
    throw new Error('Database key is not configured');
  }
  
  console.log('🔧 Database configuration:');
  console.log('  SUPABASE_URL:', SUPABASE_URL);
  console.log('  SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');
  console.log('  SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  
  // Create Supabase client with anon key (respects RLS)
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Create Supabase client with service role key (bypasses RLS)
  // Use this for server-side operations that need full access
  if (SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Service role client created for auth verification');
  } else {
    console.warn('⚠️ No service role key - auth verification may fail');
  }
  
  console.log('✅ Database clients initialized');
  
  // Test the connection
  const isConnected = await testDatabaseConnection();
  if (isConnected) {
    console.log('✅ External database connection established');
  } else {
    console.warn('⚠️ Database connection test failed, but continuing...');
  }
  
  return { supabase, supabaseAdmin };
}

// Get the Supabase client (throws if not initialized)
export function getSupabaseClient(bypassRLS: boolean = false): SupabaseClient {
  if (!supabase) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  
  if (bypassRLS && supabaseAdmin) {
    return supabaseAdmin;
  }
  if (bypassRLS && !supabaseAdmin) {
    console.warn('Service role key not available, falling back to anon key (RLS will apply)');
  }
  return supabase;
}

// Export getters for backward compatibility
export { supabase, supabaseAdmin };

// Helper function to test database connection
export async function testDatabaseConnection() {
  try {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return false;
    }
    
    const client = getSupabaseClient();
    
    // Simple connection test - try to access a known table
    // Use service role to bypass RLS for connection test
    const adminClient = supabaseAdmin || client;
    const { error } = await adminClient
      .from('pricing')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    // If pricing table doesn't exist, that's still a valid connection
    // Only fail if there's a network/auth error
    if (error && 
        !error.message.includes('relation') && 
        !error.message.includes('does not exist') &&
        !error.message.includes('permission denied')) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection test passed');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Helper function to discover available tables (best-effort)
export async function getTablesList() {
  try {
    // Since information_schema may not be exposed via PostgREST,
    // we'll probe for known tables that should exist
    const potentialTables = [
      'pricing',
      'quotes',
      'users',
      'company_details',
      'profiles',
      'user_roles',
      'user_invitations',
      'quote_templates'
    ];
    
    const existingTables = [];
    const client = getSupabaseClient(true); // Use service role for discovery
    
    for (const tableName of potentialTables) {
      try {
        const { error } = await client
          .from(tableName)
          .select('id')
          .limit(1)
          .maybeSingle();
          
        if (!error) {
          existingTables.push({ 
            table_schema: 'public', 
            table_name: tableName 
          });
        }
      } catch (err) {
        // Table doesn't exist or access denied, continue
      }
    }
    
    return existingTables;
  } catch (error) {
    console.error('Error fetching tables list:', error);
    // Return empty array instead of throwing - this is best-effort discovery
    return [];
  }
}

// Helper function to explore table structure
export async function getTableStructure(tableName: string) {
  try {
    const client = getSupabaseClient(true); // Use service role for structure discovery
    
    // Fetch one row to infer structure (more reliable than schema queries)
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .limit(1)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Infer column structure from actual data
    const columns = Object.keys(data).map(key => ({
      column_name: key,
      data_type: typeof data[key],
      is_nullable: data[key] === null ? 'YES' : 'UNKNOWN',
      column_default: null
    }));
    
    return columns;
  } catch (error) {
    console.error(`Error fetching structure for table ${tableName}:`, error);
    // Return empty array instead of throwing - this is best-effort discovery
    return [];
  }
}

// Function to find pricing-related tables (best-effort discovery)
export async function findPricingTables() {
  try {
    const allTables = await getTablesList();
    
    const pricingTables = allTables.filter(table => {
      const name = table.table_name.toLowerCase();
      return (
        name.includes('price') ||
        name.includes('pricing') ||
        name.includes('cost') ||
        name.includes('rate') ||
        name.includes('fee') ||
        name.includes('fence') ||
        name.includes('service') ||
        name.includes('product')
      );
    });
    
    // If no pricing tables found, return all discovered tables
    return pricingTables.length > 0 ? pricingTables : allTables;
  } catch (error) {
    console.error('Error finding pricing tables:', error);
    return []; // Return empty array instead of throwing
  }
}

// Generic function to fetch data from a table (READ-ONLY, with column projection)
export async function fetchTableData(tableName: string, limit?: number) {
  try {
    // Use service role for admin operations, anon for public data
    const needsServiceRole = ['pricing', 'users', 'user_roles'].includes(tableName);
    const client = getSupabaseClient(needsServiceRole);
    
    // Project only essential columns to reduce data transfer
    const columnMap: Record<string, string> = {
      'pricing': 'id,servicetype,name,height,totallmincgst,created_at',
      'quotes': 'id,clientname,phonenumber,email,serviceparts,status,created_at',
      'users': 'id,email,created_at',
      'company_details': 'id,name,phone,email,created_at'
    };
    
    const columns = columnMap[tableName] || 'id,created_at'; // Safe default
    let query = client.from(tableName).select(columns);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    return []; // Return empty array instead of throwing
  }
}

// Function to fetch pricing data by fence type (optimized)
export async function fetchPricingByType(fenceType: string) {
  try {
    // Use service role to bypass RLS for pricing data
    const client = getSupabaseClient(true);
    
    // Project only needed columns and use case-insensitive search
    const { data, error } = await client
      .from('pricing')
      .select('id,servicetype,name,height,totallmincgst,code')
      .ilike('servicetype', `%${fenceType}%`);
    
    if (error) {
      console.error('Error fetching pricing by type:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching pricing by type:', error);
    return [];
  }
}

// Function to fetch all pricing data (cached and optimized)
export async function fetchAllPricing() {
  try {
    // Use service role to bypass RLS for pricing data
    const client = getSupabaseClient(true);
    
    // Project only essential columns to reduce bandwidth
    const { data, error } = await client
      .from('pricing')
      .select('id,servicetype,name,height,totallmincgst,code,created_at')
      .order('servicetype', { ascending: true })
      .order('height', { ascending: true });
    
    if (error) {
      console.error('Error fetching all pricing:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all pricing:', error);
    throw error;
  }
}

// Function to get unique service types (optimized)
export async function getServiceTypes() {
  try {
    // Use service role to bypass RLS
    const client = getSupabaseClient(true);
    
    // Use distinct to get unique service types efficiently
    const { data, error } = await client
      .from('pricing')
      .select('servicetype')
      .not('servicetype', 'is', null)
      .order('servicetype', { ascending: true });
    
    if (error) {
      console.error('Error fetching service types:', error);
      throw error;
    }
    
    // Extract unique service types from results
    const uniqueTypes = Array.from(new Set((data || []).map((item: any) => item.servicetype)));
    return uniqueTypes;
  } catch (error) {
    console.error('Error fetching service types:', error);
    return []; // Return empty array instead of throwing
  }
}

// Legacy SQL interface for backward compatibility (deprecated)
export const sql = {
  query: async (strings: TemplateStringsArray, ...values: any[]) => {
    console.warn('DEPRECATED: SQL template literal queries not supported with Supabase REST API. Use Supabase client methods instead.');
    return [];
  }
};