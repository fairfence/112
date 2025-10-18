import {
  type User,
  type InsertUser,
  type SiteContent,
  type InsertSiteContent,
  type Testimonial,
  type InsertTestimonial,
  type FaqItem,
  type InsertFaq,
  type Service,
  type InsertService,
  type Quote,
  type InsertQuote,
  type Image,
  type InsertImage
} from "@shared/schema";
import { type IDatabaseStorage } from './database';

// Export the database interface for use throughout the application
export { type IDatabaseStorage } from './database';

// Legacy interface - use IDatabaseStorage for new code
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Site content management
  getSiteContent(): Promise<SiteContent[]>;
  updateSiteContent(section: string, key: string, value: string, updatedBy: string): Promise<SiteContent>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
  
  // FAQ management
  getFaqItems(): Promise<FaqItem[]>;
  createFaqItem(faq: InsertFaq): Promise<FaqItem>;
  updateFaqItem(id: string, faq: Partial<InsertFaq>): Promise<FaqItem>;
  deleteFaqItem(id: string): Promise<void>;
  
  // Quote management
  getQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: string, quote: Partial<Quote>): Promise<Quote>;
  deleteQuote(id: string): Promise<void>;
  
  // Image management
  getImages(): Promise<Image[]>;
  createImage(image: InsertImage): Promise<Image>;
  updateImage(id: string, image: Partial<InsertImage>): Promise<Image>;
  deleteImage(id: string): Promise<void>;
}

// Async factory function - ONLY Supabase storage is supported
export async function createStorageAsync(databaseUrl?: string): Promise<IDatabaseStorage> {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Supabase connection must be configured.');
  }

  if (!databaseUrl.includes('postgresql://') && !databaseUrl.includes('postgres://') && !databaseUrl.includes('https://')) {
    throw new Error(`Invalid DATABASE_URL format: ${databaseUrl}. Must be a valid PostgreSQL or Supabase URL.`);
  }

  console.log('📊 Using Supabase database storage');
  // Dynamic import to avoid circular dependency and premature client access
  const { SupabaseStorage } = await import('./database.js');
  return new SupabaseStorage();
}
// DEPRECATED: In-memory storage is no longer supported
// All data MUST come from Supabase
// The MemStorage class has been removed as it's no longer needed

