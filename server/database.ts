import { getSupabaseClient } from './db';
import { randomUUID } from 'crypto';
import type {
  User,
  InsertUser,
  SiteContent,
  InsertSiteContent,
  Testimonial,
  InsertTestimonial,
  FaqItem,
  InsertFaq,
  Service,
  InsertService,
  Quote,
  InsertQuote,
  Image,
  InsertImage
} from "@shared/schema";

export interface IDatabaseStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getSiteContent(): Promise<SiteContent[]>;
  getSiteContentBySection(section: string): Promise<SiteContent[]>;
  updateSiteContent(section: string, key: string, value: string, updatedBy: string): Promise<SiteContent>;
  createSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  updateSiteContentById(id: string, content: Partial<InsertSiteContent>): Promise<SiteContent>;
  deleteSiteContent(id: string): Promise<void>;

  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;

  getFaqItems(): Promise<FaqItem[]>;
  createFaqItem(faq: InsertFaq): Promise<FaqItem>;
  updateFaqItem(id: string, faq: Partial<InsertFaq>): Promise<FaqItem>;
  deleteFaqItem(id: string): Promise<void>;

  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  getQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: string, quote: Partial<Quote>): Promise<Quote>;
  deleteQuote(id: string): Promise<void>;

  getImages(): Promise<Image[]>;
  createImage(image: InsertImage): Promise<Image>;
  updateImage(id: string, image: Partial<InsertImage>): Promise<Image>;
  deleteImage(id: string): Promise<void>;
}

export class SupabaseStorage implements IDatabaseStorage {
  async getUser(id: string): Promise<User | undefined> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSiteContent(): Promise<SiteContent[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section');

    if (error) throw error;
    return data || [];
  }

  async getSiteContentBySection(section: string): Promise<SiteContent[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section);

    if (error) throw error;
    return data || [];
  }

  async updateSiteContent(section: string, key: string, value: string, updatedBy: string): Promise<SiteContent> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('site_content')
      .update({ value, updated_by: updatedBy, updated_at: new Date().toISOString() })
      .eq('section', section)
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('site_content')
      .insert([content])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSiteContentById(id: string, content: Partial<InsertSiteContent>): Promise<SiteContent> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('site_content')
      .update(content)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSiteContent(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTestimonial(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getFaqItems(): Promise<FaqItem[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .order('order_index');

    if (error) throw error;
    return data || [];
  }

  async createFaqItem(faq: InsertFaq): Promise<FaqItem> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('faq_items')
      .insert([faq])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateFaqItem(id: string, faq: Partial<InsertFaq>): Promise<FaqItem> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('faq_items')
      .update(faq)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFaqItem(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getServices(): Promise<Service[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  async createService(service: InsertService): Promise<Service> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteService(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getQuotes(): Promise<Quote[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quotes')
      .insert([quote])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateQuote(id: string, quote: Partial<Quote>): Promise<Quote> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quotes')
      .update(quote)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteQuote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getImages(): Promise<Image[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createImage(image: InsertImage): Promise<Image> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('images')
      .insert([image])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateImage(id: string, image: Partial<InsertImage>): Promise<Image> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('images')
      .update(image)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteImage(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
