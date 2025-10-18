/**
 * Asset Filename Validation Utility
 *
 * Ensures uploaded assets follow proper naming conventions
 * to prevent import resolution issues in Vite/TypeScript
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestedName?: string;
}

/**
 * Validates an asset filename against project standards
 */
export function validateAssetFilename(filename: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let suggestedName = filename;

  // Check for spaces
  if (/\s/.test(filename)) {
    errors.push('Filename contains spaces');
    suggestedName = suggestedName.replace(/\s+/g, '_');
  }

  // Check for "copy" pattern
  if (/copy/i.test(filename)) {
    warnings.push('Filename contains "copy" - consider using a descriptive name');
    suggestedName = suggestedName.replace(/\s*copy\s*/gi, '');
  }

  // Check for multiple dots (except before extension)
  const parts = filename.split('.');
  if (parts.length > 2) {
    warnings.push('Filename contains multiple dots');
  }

  // Check for special characters
  if (/[^a-zA-Z0-9._-]/.test(filename.replace(/\s/g, ''))) {
    errors.push('Filename contains special characters (only letters, numbers, dots, hyphens, and underscores allowed)');
    suggestedName = suggestedName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Check extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.JPG', '.JPEG', '.PNG'];
  const hasValidExtension = validExtensions.some(ext => filename.toLowerCase().endsWith(ext.toLowerCase()));

  if (!hasValidExtension) {
    errors.push('Invalid file extension (allowed: jpg, jpeg, png, gif, webp, svg)');
  }

  // Check for excessively long names
  if (filename.length > 100) {
    warnings.push('Filename is very long (>100 characters)');
  }

  // Check for sequential underscores or hyphens
  if (/__+/.test(filename) || /--+/.test(filename)) {
    warnings.push('Filename contains sequential underscores or hyphens');
    suggestedName = suggestedName.replace(/__+/g, '_').replace(/--+/g, '-');
  }

  // Clean up the suggested name
  suggestedName = suggestedName
    .replace(/^[_-]+/, '') // Remove leading underscores/hyphens
    .replace(/[_-]+$/, '') // Remove trailing underscores/hyphens (before extension)
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/-{2,}/g, '-'); // Replace multiple hyphens with single

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestedName: suggestedName !== filename ? suggestedName : undefined
  };
}

/**
 * Sanitizes a filename to meet project standards
 */
export function sanitizeAssetFilename(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.'));
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

  let sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '_') // Spaces to underscores
    .replace(/copy/gi, '') // Remove "copy"
    .replace(/[^a-z0-9._-]/g, '_') // Remove special chars
    .replace(/_{2,}/g, '_') // Multiple underscores to single
    .replace(/^[_-]+/, '') // Remove leading underscores/hyphens
    .replace(/[_-]+$/, ''); // Remove trailing underscores/hyphens

  return `${sanitized}${ext.toLowerCase()}`;
}

/**
 * Generates a descriptive asset name based on context
 */
export function generateDescriptiveName(
  originalName: string,
  context?: {
    category?: string;
    description?: string;
    timestamp?: boolean;
  }
): string {
  const ext = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
  const parts: string[] = [];

  if (context?.category) {
    parts.push(context.category);
  }

  if (context?.description) {
    parts.push(context.description.toLowerCase().replace(/\s+/g, '_'));
  }

  if (context?.timestamp) {
    parts.push(Date.now().toString());
  }

  const sanitizedOriginal = sanitizeAssetFilename(originalName);
  const nameWithoutExt = sanitizedOriginal.substring(0, sanitizedOriginal.lastIndexOf('.'));

  if (parts.length === 0 || !context?.description) {
    parts.push(nameWithoutExt);
  }

  return parts.join('_') + ext;
}

/**
 * Validates multiple filenames and returns a summary
 */
export function validateAssetBatch(filenames: string[]): {
  totalValid: number;
  totalInvalid: number;
  results: Map<string, ValidationResult>;
} {
  const results = new Map<string, ValidationResult>();
  let totalValid = 0;
  let totalInvalid = 0;

  for (const filename of filenames) {
    const result = validateAssetFilename(filename);
    results.set(filename, result);

    if (result.valid) {
      totalValid++;
    } else {
      totalInvalid++;
    }
  }

  return { totalValid, totalInvalid, results };
}
