# Scripts Directory

Utility scripts for maintaining the FairFence application.

## Available Scripts

### `audit-assets.ts`

Comprehensive asset audit tool that scans the `attached_assets/` directory and reports:

- **Invalid filenames** - Files that don't follow naming conventions
- **Warnings** - Files with non-critical issues (e.g., "copy" in name)
- **Unreferenced assets** - Files not imported anywhere (cleanup candidates)
- **Large files** - Assets > 500KB that could be optimized
- **Summary statistics** - Total count, size, and health metrics

**Usage:**
```bash
npm run audit:assets
```

**Example Output:**
```
🔍 FairFence Asset Audit
============================================================

📁 Found 42 total files in attached_assets/

📊 Summary
------------------------------------------------------------
Total Assets: 42
Total Size: 15.3 MB
Invalid Names: 3
With Warnings: 2
Unreferenced: 8

❌ Invalid Asset Names
------------------------------------------------------------
📄 IMG_0562 copy copy.JPG
   Size: 1.2 MB
   Errors:
     • Filename contains spaces
   💡 Suggested: img_0562.jpg
```

**Exit Codes:**
- `0` - All assets valid
- `1` - Invalid assets found

## Running Scripts

All scripts in this directory can be run with `tsx`:

```bash
# Direct execution
npx tsx scripts/audit-assets.ts

# Or use npm scripts (if defined in package.json)
npm run audit:assets
```

## Adding New Scripts

1. Create a new `.ts` file in this directory
2. Add shebang: `#!/usr/bin/env tsx`
3. Make it executable: `chmod +x scripts/your-script.ts`
4. Add npm script in `package.json`:
   ```json
   "scripts": {
     "your-script": "tsx scripts/your-script.ts"
   }
   ```

## Best Practices

- Use TypeScript for type safety
- Import shared utilities from `server/` or `shared/`
- Provide clear output with colors/icons
- Include help text with `--help` flag
- Return appropriate exit codes
- Handle errors gracefully
- Document in this README
