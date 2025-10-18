# Project Cleanup Plan

## Executive Summary

After comprehensive audit of all project folders and files, this document identifies redundant, unused, and outdated files that can be safely removed to improve project maintainability and reduce technical debt.

## 🔴 CRITICAL: Files to Remove Immediately

### 1. Root Directory Clutter (9 files)

**Issue:** Temporary/debug files in project root

#### Screenshots (6 files) - ~1MB
- `after-submit.png`
- `submit-verify.png`
- `after-click-contact.png`
- `after-select-timber.png`
- `service-open-contact.png`

**Why Remove:** These appear to be temporary debugging/testing screenshots. Should be in `docs/screenshots/` if needed.

#### SQL Scripts (3 files)
- `check_all_duplicates.sql`
- `fix_pricing_dropdown.sql`
- `delete_duplicate_entries.sql`

**Why Remove:** These are one-time migration/fix scripts. Already applied to database. Should be archived or deleted.

#### Cookies File (1 file)
- `cookies.txt`

**Why Remove:** Contains authentication cookies. Security risk. Not needed in codebase.

### 2. Redundant Server Files (3 files)

**Issue:** Unused/empty alternative implementations

#### Files:
- `server/db.js` - Empty/1-line file (TypeScript version `db.ts` is used)
- `server/database.ts` - Interface definitions (redundant with usage in routes.ts)
- `server/dbSetup.ts` - Table creation utilities (tables created via migrations now)

**Why Remove:**
- `db.js` is superseded by `db.ts`
- `database.ts` interfaces are unused (direct Supabase client calls used)
- `dbSetup.ts` deprecated in favor of Supabase migrations

### 3. Empty/Stub File (1 file)

**Issue:** Incomplete implementation

#### File:
- `AuthProvider` (root directory) - 1-line stub file

**Why Remove:** Not a complete component. No extension. Likely leftover from refactoring. Auth is in `client/src/hooks/use-auth.tsx`.

### 4. Outdated Context Files (2 files)

**Issue:** Outdated database schema documentation

#### Files:
- `context/databaseIndexes.json`
- `context/newContext.json`

**Why Remove:** Schema has changed significantly. These reference old tables (`profiles`, `quote_templates`) that may not exist. Current schema is in migrations.

## 🟡 CONSIDER REMOVING: Legacy/Unused Features

### 5. Unused Attached Assets (50+ files)

**Issue:** Many image files with poor naming conventions not used in app

#### Pattern:
- `IMG_####_timestamp.jpeg` (e.g., `IMG_0478_1758750142437.jpeg`)
- Duplicate files with "copy" suffixes
- Files like `IMG_0562.JPG`, `IMG_0562 copy.JPG`, `IMG_0562 copy copy.JPG`, etc.

**Currently Used Images:**
- `IMG_0032_1758750142435.jpeg` ✅
- `IMG_0874_1758750142436.jpeg` ✅
- `IMG_0852_1758750142436.jpeg` ✅
- `IMG_0456_1758750142437.jpeg` ✅
- `IMG_0801_1758753451867.jpeg` ✅ (logo)
- `IMG_0562_rural_fence.JPG` ✅
- `IMG_0874_1758784125349.jpeg` ✅
- `IMG_0457_1758784382482.jpeg` ✅
- `IMG_0456_1758784382482.jpeg` ✅

**Unused Images to Remove:** (~40+ files)
- All `IMG_*` files NOT in the "Currently Used" list above
- All screenshot PNG files from `attached_assets/`
- All "copy" variants of `IMG_0562.JPG`
- Files like: `IMG_0644`, `IMG_0672`, `IMG_0729`, `IMG_0801` (non-logo versions), etc.

### 6. WordPress Plugin (Conditional)

**Issue:** Unused WordPress integration

#### Directory:
- `wordpress-plugin/` (entire directory)
- `vite.config.wordpress.ts`
- Package.json script: `build:wordpress`

**Decision:** Keep if WordPress integration is planned. Remove if standalone app only.

**Current Status:** Files exist but no active WordPress integration. Plugin looks complete but unused.

## 🟢 KEEP: Important Documentation & Backups

### Files to Keep:

#### Documentation (Keep All)
- `README.md` - Project overview
- `docs/` folder - All documentation
- `ASSET_FIX_SUMMARY.md` - Recent changes
- `SITE_SURVEY_IMPLEMENTATION.md` - Feature docs
- `RLS_FIX_SUMMARY.md` - Security changes
- `SECURITY_FIX_INSTRUCTIONS.md` - Security guide

#### Backups (Keep All)
- `database-backup/` - Full database backup with migrations
  - Keep for disaster recovery
  - Documents schema evolution

#### Active Assets (Keep All)
- `attached_assets/fencing/` - All fence type images (6 files)
- `attached_assets/stock_images/` - Stock photos (3 files)
- Currently used IMG files (9 files listed above)

## 📊 Impact Analysis

### Files to Remove Summary

| Category | Count | Size | Impact |
|----------|-------|------|--------|
| Root screenshots | 5 | ~800KB | None - debug only |
| Root SQL scripts | 3 | ~10KB | None - already applied |
| Cookies file | 1 | <1KB | **Security improvement** |
| Server redundant | 3 | ~20KB | None - unused |
| Stub file | 1 | <1KB | None - incomplete |
| Context files | 2 | ~2KB | None - outdated |
| Unused images | 40+ | ~15MB | None - not imported |
| **TOTAL** | **55+** | **~16MB** | **Cleaner codebase** |

### Benefits of Cleanup

1. **Security**: Remove `cookies.txt` with auth tokens
2. **Clarity**: Remove confusion from old/unused files
3. **Storage**: Save ~16MB of unused assets
4. **Maintenance**: Easier to understand active codebase
5. **Performance**: Smaller repository, faster cloning

### Risks

- **Low Risk**: Most files are demonstrably unused
- **Medium Risk**: Asset removal (verify no dynamic imports)
- **Mitigation**: Keep database backup intact for recovery

## 🔧 Recommended Action Plan

### Phase 1: Immediate (Security & Obvious Cleanup)

```bash
# Remove security risk
rm cookies.txt

# Remove debug screenshots from root
rm after-*.png submit-verify.png service-open-contact.png

# Remove one-time SQL scripts
rm check_all_duplicates.sql fix_pricing_dropdown.sql delete_duplicate_entries.sql

# Remove redundant/empty server files
rm server/db.js AuthProvider

# Remove outdated context
rm -rf context/
```

### Phase 2: Code Verification

```bash
# Before removing unused images, verify no dynamic imports exist
grep -r "IMG_" client/src/ | grep -v "node_modules"
# Only remove images NOT found in grep results
```

### Phase 3: Asset Cleanup (After Verification)

```bash
# Remove duplicate IMG_0562 variants
rm attached_assets/IMG_0562\ copy*.JPG

# Remove unused timestamped images (verify list first)
# Create script to remove only confirmed unused images
```

### Phase 4: WordPress Decision

```bash
# IF WordPress integration not needed:
rm -rf wordpress-plugin/
rm vite.config.wordpress.ts
# Update package.json to remove build:wordpress script
```

## ⚠️ Important Notes

### DO NOT REMOVE

1. **Migrations**: All files in `supabase/migrations/` - critical for database
2. **Backups**: All files in `database-backup/` - disaster recovery
3. **Documentation**: All `.md` files in `docs/` - project knowledge
4. **Active Assets**: Fence images and images used in components
5. **Config Files**: `package.json`, `tsconfig.json`, `vite.config.ts`, etc.
6. **Source Code**: All `.ts`, `.tsx` files in `client/src/` and `server/`

### Verification Before Deletion

For each file/directory proposed for removal:

1. ✅ Search for imports: `grep -r "filename" client/src/`
2. ✅ Check for dynamic requires: `grep -r "require.*filename"`
3. ✅ Verify not referenced in config
4. ✅ Test build after removal: `npm run build`
5. ✅ Commit to version control before deletion (safety net)

## 🎯 Expected Outcome

After cleanup:

- **Cleaner root directory**: Only essential config files
- **Organized assets**: Only used images with proper naming
- **Clear codebase**: No redundant/confusing files
- **Better security**: No exposed credentials
- **Easier onboarding**: New developers see only active code
- **Smaller repo**: ~16MB reduction in size

## 📝 Errors Found

### Critical Issues

1. **Security**: `cookies.txt` in root - should NEVER be committed
2. **Empty files**: `server/db.js` and `AuthProvider` are essentially empty

### Maintenance Issues

1. **Naming**: Many images use timestamps instead of descriptive names
2. **Organization**: Root directory has temp files that should be elsewhere
3. **Duplication**: Multiple copies of same image with "copy" suffix

### Technical Debt

1. **Unused code**: `database.ts` and `dbSetup.ts` no longer used
2. **Outdated docs**: Context JSON files don't match current schema
3. **Inconsistency**: Mix of `.jpg`, `.JPG`, `.jpeg` extensions

## 🚀 Next Steps

1. **Review** this plan with team/stakeholders
2. **Backup** entire project before any deletions
3. **Execute** Phase 1 (immediate security cleanup)
4. **Test** build and application after Phase 1
5. **Proceed** to Phase 2-4 if Phase 1 successful
6. **Document** any kept files with justification
7. **Update** `.gitignore` to prevent future similar issues

---

**Created**: 2025-10-16
**Last Updated**: 2025-10-16
**Status**: Ready for Review
**Priority**: High (security issues present)
