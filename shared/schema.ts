import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// EXISTING PRICING TABLE - DO NOT MODIFY STRUCTURE
export const pricing = pgTable("pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  servicetype: text("servicetype").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  height: numeric("height").notNull(),
  spansize: numeric("spansize").notNull(),
  panelcost: numeric("panelcost").notNull(),
  perlm: numeric("perlm").notNull(),
  labourperpanel: numeric("labourperpanel").notNull(),
  labourperm: numeric("labourperm").notNull(),
  totalperpanel: numeric("totalperpanel").notNull(),
  totallmincgst: numeric("totallmincgst").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site content management
export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull(), // 'hero', 'about', 'business'
  key: text("key").notNull(),         // 'title', 'tagline', 'phone'  
  value: text("value").notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").default(""),
  rating: integer("rating").default(5),
  text: text("text").notNull(),
  source: text("source").default("Google"),
  date: text("date").default(""),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// FAQ items
export const faqItems = pgTable("faq_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  orderIndex: integer("order_index").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service management
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: text("service_id").notNull().unique(), // 'timber', 'aluminum', etc.
  title: text("title").notNull(),
  description: text("description").default(""),
  features: text("features").default(""), // JSON array string
  priceRange: text("price_range").default(""),
  isActive: boolean("is_active").default(true),
  orderIndex: integer("order_index").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company details
export const companyDetails = pgTable("company_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  taxRate: numeric("tax_rate").default("0"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quote requests from contact form - matches Supabase table structure
export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id"),
  clientname: text("clientname").notNull(),
  address: text("address").default(""),
  issiteaddressdifferent: boolean("issiteaddressdifferent").default(false),
  siteaddress: text("siteaddress").default(""),
  phonenumber: text("phonenumber").notNull(),
  email: text("email").default(""),
  projectname: text("projectname").default(""),
  status: text("status").default("new"), // 'new', 'contacted', 'quoted', 'completed'
  total: numeric("total").default("0"),
  serviceparts: text("serviceparts").default(""), // JSON or text description
  images: text("images").default(""), // JSON array of image URLs
  date: timestamp("date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertFaqSchema = createInsertSchema(faqItems).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  updatedAt: true,
});

export const insertCompanyDetailsSchema = createInsertSchema(companyDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  status: true,
  date: true,
  created_at: true,
});

// Images table for media management
export const images = pgTable("images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  category: text("category").default(""),
  alt: text("alt").default(""),
  size: integer("size").default(0), // File size in bytes
  mimeType: text("mime_type").default(""),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  isPublic: boolean("is_public").default(true),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  uploadedAt: true,
});

// Site Surveys tables for detailed fence quote requests
export const siteSurveys = pgTable("site_surveys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  propertyAddress: text("property_address").notNull(),
  removalRequired: boolean("removal_required").default(false),
  additionalNotes: text("additional_notes"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fenceLines = pgTable("fence_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  surveyId: varchar("survey_id").notNull().references(() => siteSurveys.id, { onDelete: "cascade" }),
  lineDescription: text("line_description"),
  length: numeric("length").notNull(),
  height: text("height"),
  fenceType: text("fence_type").notNull(),
  railWireCount: text("rail_wire_count"),
  specialNotes: text("special_notes"),
  lineOrder: integer("line_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const surveyPhotos = pgTable("survey_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  surveyId: varchar("survey_id").notNull().references(() => siteSurveys.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  storagePath: text("storage_path").notNull(),
  url: text("url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertSiteSurveySchema = createInsertSchema(siteSurveys).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFenceLineSchema = createInsertSchema(fenceLines).omit({
  id: true,
  createdAt: true,
});

export const insertSurveyPhotoSchema = createInsertSchema(surveyPhotos).omit({
  id: true,
  uploadedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type CompanyDetails = typeof companyDetails.$inferSelect;
export type InsertCompanyDetails = z.infer<typeof insertCompanyDetailsSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type SiteSurvey = typeof siteSurveys.$inferSelect;
export type InsertSiteSurvey = z.infer<typeof insertSiteSurveySchema>;
export type FenceLine = typeof fenceLines.$inferSelect;
export type InsertFenceLine = z.infer<typeof insertFenceLineSchema>;
export type SurveyPhoto = typeof surveyPhotos.$inferSelect;
export type InsertSurveyPhoto = z.infer<typeof insertSurveyPhotoSchema>;
