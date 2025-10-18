#!/usr/bin/env tsx
/**
 * Asset Audit Script
 *
 * Scans the attached_assets directory and identifies:
 * - Files with problematic names
 * - Unused assets (not imported anywhere)
 * - Missing assets (imported but not found)
 * - Optimization opportunities
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { validateAssetFilename } from '../server/asset-validator';

const ASSETS_DIR = join(process.cwd(), 'attached_assets');
const CLIENT_SRC = join(process.cwd(), 'client/src');

interface AssetInfo {
  path: string;
  relativePath: string;
  size: number;
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestedName?: string;
  referencedIn: string[];
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function findAssetReferences(assetPath: string, searchDir: string): string[] {
  const references: string[] = [];
  const files = getAllFiles(searchDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const assetName = assetPath.split('/').pop() || '';

  files.forEach(file => {
    try {
      const content = require('fs').readFileSync(file, 'utf-8');
      if (content.includes(assetName)) {
        references.push(relative(process.cwd(), file));
      }
    } catch (err) {
      // Skip files that can't be read
    }
  });

  return references;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function auditAssets() {
  console.log('🔍 FairFence Asset Audit');
  console.log('=' .repeat(60));
  console.log();

  if (!existsSync(ASSETS_DIR)) {
    console.error('❌ Assets directory not found:', ASSETS_DIR);
    process.exit(1);
  }

  const allAssets = getAllFiles(ASSETS_DIR);
  const assetInfos: AssetInfo[] = [];

  console.log(`📁 Found ${allAssets.length} total files in attached_assets/`);
  console.log();

  // Analyze each asset
  for (const assetPath of allAssets) {
    const fileName = assetPath.split('/').pop() || '';
    const relativePath = relative(ASSETS_DIR, assetPath);
    const stats = statSync(assetPath);
    const validation = validateAssetFilename(fileName);
    const references = findAssetReferences(relativePath, CLIENT_SRC);

    assetInfos.push({
      path: assetPath,
      relativePath,
      size: stats.size,
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
      suggestedName: validation.suggestedName,
      referencedIn: references
    });
  }

  // Summary Statistics
  const totalSize = assetInfos.reduce((sum, asset) => sum + asset.size, 0);
  const invalidCount = assetInfos.filter(a => !a.valid).length;
  const warningCount = assetInfos.filter(a => a.warnings.length > 0).length;
  const unreferencedCount = assetInfos.filter(a => a.referencedIn.length === 0).length;

  console.log('📊 Summary');
  console.log('-'.repeat(60));
  console.log(`Total Assets: ${allAssets.length}`);
  console.log(`Total Size: ${formatSize(totalSize)}`);
  console.log(`Invalid Names: ${invalidCount}`);
  console.log(`With Warnings: ${warningCount}`);
  console.log(`Unreferenced: ${unreferencedCount}`);
  console.log();

  // Invalid Assets
  if (invalidCount > 0) {
    console.log('❌ Invalid Asset Names');
    console.log('-'.repeat(60));
    assetInfos
      .filter(a => !a.valid)
      .forEach(asset => {
        console.log(`\n📄 ${asset.relativePath}`);
        console.log(`   Size: ${formatSize(asset.size)}`);
        console.log(`   Errors:`);
        asset.errors.forEach(err => console.log(`     • ${err}`));
        if (asset.suggestedName) {
          console.log(`   💡 Suggested: ${asset.suggestedName}`);
        }
        if (asset.referencedIn.length > 0) {
          console.log(`   ⚠️  Used in ${asset.referencedIn.length} file(s)`);
        }
      });
    console.log();
  }

  // Warnings
  if (warningCount > 0) {
    console.log('⚠️  Assets with Warnings');
    console.log('-'.repeat(60));
    assetInfos
      .filter(a => a.warnings.length > 0 && a.valid)
      .forEach(asset => {
        console.log(`\n📄 ${asset.relativePath}`);
        asset.warnings.forEach(warn => console.log(`   • ${warn}`));
        if (asset.suggestedName) {
          console.log(`   💡 Suggested: ${asset.suggestedName}`);
        }
      });
    console.log();
  }

  // Unreferenced Assets
  if (unreferencedCount > 0) {
    console.log('🗑️  Unreferenced Assets (potential cleanup candidates)');
    console.log('-'.repeat(60));
    const unreferenced = assetInfos.filter(a => a.referencedIn.length === 0);
    const unreferencedSize = unreferenced.reduce((sum, a) => sum + a.size, 0);
    console.log(`Total: ${unreferencedCount} files (${formatSize(unreferencedSize)})\n`);

    unreferenced.forEach(asset => {
      console.log(`   ${asset.relativePath} (${formatSize(asset.size)})`);
    });
    console.log();
  }

  // Large Assets
  const largeAssets = assetInfos.filter(a => a.size > 500 * 1024); // > 500KB
  if (largeAssets.length > 0) {
    console.log('📦 Large Assets (> 500KB - consider optimization)');
    console.log('-'.repeat(60));
    largeAssets
      .sort((a, b) => b.size - a.size)
      .forEach(asset => {
        console.log(`   ${asset.relativePath}: ${formatSize(asset.size)}`);
      });
    console.log();
  }

  // Recommendations
  console.log('💡 Recommendations');
  console.log('-'.repeat(60));
  if (invalidCount > 0) {
    console.log('• Fix invalid asset names to prevent import issues');
  }
  if (unreferencedCount > 0) {
    console.log('• Review unreferenced assets for removal');
  }
  if (largeAssets.length > 0) {
    console.log('• Optimize large images (compress, resize, convert to WebP)');
  }
  if (invalidCount === 0 && warningCount === 0) {
    console.log('✅ All assets follow naming conventions!');
  }
  console.log();

  process.exit(invalidCount > 0 ? 1 : 0);
}

auditAssets().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
