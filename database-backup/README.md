# FairFence Database Backup

**Created:** October 3, 2025
**Project:** FairFence Contracting Waikato

## 📦 What's Included

This backup contains the complete database schema and initial data for the FairFence Contracting Waikato application.

### Files

- **COMPLETE_DATABASE_BACKUP.sql** - Complete database schema, policies, and data

## 📊 Database Contents

### Tables

1. **images** - Media management for fence photos and portfolio images
2. **site_content** - Editable content for all website sections
3. **testimonials** - Customer reviews and ratings
4. **faq_items** - Frequently asked questions
5. **pricing** - Fencing pricing data (referenced but not in migrations)
6. **quotes** - Customer quote requests (referenced but not in migrations)

### Data Included

#### Site Content (~50+ entries)
- Hero section content
- Process timeline (5 steps)
- Services descriptions (timber, aluminum, vinyl, rural)
- About section content
- Business contact information
- Rating and review configuration

#### Sample Data
- 3 testimonials (Google reviews)
- 6 FAQ items (common questions)
- 3 sample images

## 🔄 How to Restore

### Option 1: Supabase Dashboard (Recommended)

1. Log into your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire contents of `COMPLETE_DATABASE_BACKUP.sql`
5. Click **Run** to execute
6. Verify tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

### Option 2: Command Line

```bash
# Using Supabase CLI
supabase db reset
cat COMPLETE_DATABASE_BACKUP.sql | supabase db execute

# Or use psql directly
psql -h db.your-project.supabase.co -U postgres -d postgres -f COMPLETE_DATABASE_BACKUP.sql
```

## ✅ Verification

After restoring, verify the data:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count records
SELECT 'site_content' as table_name, COUNT(*) as records FROM site_content
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'faq_items', COUNT(*) FROM faq_items
UNION ALL
SELECT 'images', COUNT(*) FROM images;

-- View rating configuration
SELECT * FROM site_content WHERE section = 'business' AND key LIKE 'rating%';
```

Expected results:
- **site_content**: ~50+ records
- **testimonials**: 3 records
- **faq_items**: 6 records
- **images**: 3 records

## 🔐 Security Features

All tables include:
- ✅ Row Level Security (RLS) enabled
- ✅ Public read access for appropriate data
- ✅ Authenticated-only write access
- ✅ Proper foreign key constraints
- ✅ Optimized indexes for performance

## 📝 Migration History

This backup consolidates the following migrations:

1. `20250929223448_fierce_lagoon.sql` - Images table
2. `20250930000007_solitary_shrine.sql` - Site content table
3. `20250930000303_red_shape.sql` - Additional site content
4. `20251001000001_security_optimization.sql` - Security improvements
5. `20251001075651_create_testimonials_table.sql` - Testimonials
6. `20251001075709_create_faq_items_table.sql` - FAQ items
7. `20251002000001_add_rating_config.sql` - Rating configuration

## 🚀 Next Steps

After restoring the database:

1. **Update Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Customize Content**
   - Log into admin panel at `/admin`
   - Navigate to Settings > Reviews to update ratings
   - Update site content as needed

3. **Add Real Data**
   - Replace sample testimonials with real reviews
   - Update FAQ items to match your actual questions
   - Upload your fence photos to replace samples

## 🆘 Troubleshooting

### Issue: "relation already exists"
**Solution:** Tables already exist. Either:
- Drop tables first: `DROP TABLE IF EXISTS images, site_content, testimonials, faq_items CASCADE;`
- Or skip to data restoration only

### Issue: "permission denied"
**Solution:** Ensure you're using the service role key for admin operations

### Issue: RLS policies blocking queries
**Solution:** Verify you're authenticated or the data is marked as public

## 📞 Support

For questions about this backup or restoration:
- Check migration files in `supabase/migrations/`
- Review schema in `shared/schema.ts`
- Contact: Admin@fairfence.co.nz

---

**Last Updated:** October 3, 2025
**Version:** 1.0
**Compatible With:** Supabase PostgreSQL 15+
