/**
 * Configuration management module
 * Delegates to config-loader for actual loading logic
 * Provides backward compatibility layer for existing code
 */

import configLoader, { type AppConfiguration } from './config-loader';

class ConfigurationManager {
  private isInitialized = false;

  /**
   * Initialize configuration by loading from config-loader
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('Initializing configuration...');
    await configLoader.load();
    this.isInitialized = true;
  }

  /**
   * Get a configuration value
   */
  get<K extends keyof AppConfiguration>(key: K): AppConfiguration[K] {
    const config = configLoader.getCurrent();
    if (!config) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }
    return config[key];
  }

  /**
   * Get all configuration values
   */
  getAll(): AppConfiguration {
    const config = configLoader.getCurrent();
    if (!config) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }
    return { ...config };
  }

  /**
   * Check if configuration is loaded from WordPress
   */
  isUsingWordPress(): boolean {
    const status = configLoader.getStatus();
    return status.mode === 'wordpress';
  }

  /**
   * Reload configuration (useful for testing or when WordPress config changes)
   */
  async reload(): Promise<void> {
    await configLoader.reload();
    this.isInitialized = true;
  }

  /**
   * Get configuration status for debugging
   */
  getStatus(): { initialized: boolean; mode: 'wordpress' | 'environment' | null; hasServiceKey: boolean } {
    try {
      const status = configLoader.getStatus();
      return {
        initialized: status.initialized,
        mode: status.mode,
        hasServiceKey: status.hasServiceKey,
      };
    } catch (error) {
      console.error('Error getting config status:', error);
      return {
        initialized: false,
        mode: null,
        hasServiceKey: false,
      };
    }
  }
}

// Create singleton instance
const configManager = new ConfigurationManager();

// Export singleton instance and methods
export default configManager;
export const initializeConfig = () => configManager.initialize();
export const getConfig = <K extends keyof AppConfiguration>(key: K) => configManager.get(key);
export const getAllConfig = () => configManager.getAll();
export const isUsingWordPress = () => configManager.isUsingWordPress();
export const reloadConfig = () => configManager.reload();
export const getConfigStatus = () => configManager.getStatus();