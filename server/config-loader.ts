/**
 * Configuration Loader Module
 * Handles loading configuration from WordPress API or environment variables
 * with caching for performance optimization
 */

import { log } from "./vite";

interface WordPressApiConfig {
  supabase_url?: string;
  supabase_anon_key?: string;
  supabase_service_key?: string;
  session_secret?: string;
  stripe_public_key?: string;
  stripe_secret_key?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_password?: string;
}

interface AppConfiguration {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  DATABASE_URL?: string;
  SESSION_SECRET?: string;
  STRIPE_PUBLIC_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  PORT?: string;
  WORDPRESS_API_URL?: string;
}

interface ConfigCache {
  config: AppConfiguration | null;
  timestamp: number;
  mode: 'wordpress' | 'environment' | null;
}

class ConfigLoader {
  private cache: ConfigCache = {
    config: null,
    timestamp: 0,
    mode: null
  };

  private readonly CACHE_TTL = 5 * 60 * 1000;

  private isCacheValid(): boolean {
    return (
      this.cache.config !== null &&
      Date.now() - this.cache.timestamp < this.CACHE_TTL
    );
  }

  async loadConfig(): Promise<AppConfiguration> {
    if (this.isCacheValid()) {
      log(`Using cached config (${this.cache.mode} mode)`);
      return this.cache.config!;
    }

    const wordpressApiUrl = process.env.WORDPRESS_API_URL;

    if (wordpressApiUrl) {
      try {
        const config = await this.loadFromWordPress(wordpressApiUrl);
        this.updateCache(config, 'wordpress');
        return config;
      } catch (error) {
        log(`WordPress API failed, falling back to environment variables: ${error}`);
        const config = this.loadFromEnvironment();
        this.updateCache(config, 'environment');
        return config;
      }
    }

    const config = this.loadFromEnvironment();
    this.updateCache(config, 'environment');
    return config;
  }

  private async loadFromWordPress(apiUrl: string): Promise<AppConfiguration> {
    const response = await fetch(`${apiUrl}/wp-json/fairfence/v1/config`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`);
    }

    const wpConfig: WordPressApiConfig = await response.json();

    if (!wpConfig.supabase_url || !wpConfig.supabase_anon_key) {
      throw new Error('WordPress config missing required Supabase credentials');
    }

    return {
      SUPABASE_URL: wpConfig.supabase_url,
      SUPABASE_ANON_KEY: wpConfig.supabase_anon_key,
      SUPABASE_SERVICE_ROLE_KEY: wpConfig.supabase_service_key,
      DATABASE_URL: wpConfig.supabase_url?.replace('https://', 'postgresql://postgres:@') + '/postgres',
      SESSION_SECRET: wpConfig.session_secret || this.generateSessionSecret(),
      STRIPE_PUBLIC_KEY: wpConfig.stripe_public_key,
      STRIPE_SECRET_KEY: wpConfig.stripe_secret_key,
      SMTP_HOST: wpConfig.smtp_host,
      SMTP_PORT: wpConfig.smtp_port,
      SMTP_USER: wpConfig.smtp_user,
      SMTP_PASSWORD: wpConfig.smtp_password,
      WORDPRESS_API_URL: apiUrl,
    };
  }

  private loadFromEnvironment(): AppConfiguration {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment');
    }

    return {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: supabaseAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      SESSION_SECRET: process.env.SESSION_SECRET || this.generateSessionSecret(),
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD,
      PORT: process.env.PORT,
    };
  }

  private updateCache(config: AppConfiguration, mode: 'wordpress' | 'environment'): void {
    this.cache = {
      config,
      timestamp: Date.now(),
      mode
    };
    log(`Config loaded and cached (${mode} mode)`);
  }

  private generateSessionSecret(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  clearCache(): void {
    this.cache = {
      config: null,
      timestamp: 0,
      mode: null
    };
    log('Config cache cleared');
  }

  async load(): Promise<void> {
    await this.loadConfig();
  }

  getCurrent(): AppConfiguration | null {
    return this.cache.config;
  }

  getStatus(): { initialized: boolean; mode: 'wordpress' | 'environment' | null; hasServiceKey: boolean } {
    return {
      initialized: this.cache.config !== null,
      mode: this.cache.mode,
      hasServiceKey: Boolean(this.cache.config?.SUPABASE_SERVICE_ROLE_KEY),
    };
  }

  async reload(): Promise<void> {
    this.clearCache();
    await this.loadConfig();
  }
}

const configLoader = new ConfigLoader();
export default configLoader;
export type { AppConfiguration };
