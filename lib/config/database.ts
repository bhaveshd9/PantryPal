// Database configuration
export const databaseConfig = {
  // Database mode configuration
  useDemoData: process.env.NODE_ENV === 'development' && !process.env.USE_REAL_DB,
  
  // Prisma configuration
  prisma: {
    // Database URL from environment variable
    databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    
    // Logging configuration
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  },
  
  // Demo data configuration
  demo: {
    // Whether to persist demo data in localStorage
    persistInLocalStorage: true,
    
    // Demo data refresh interval (in milliseconds)
    refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Environment validation
export function validateDatabaseConfig() {
  const errors: string[] = [];
  
  if (!databaseConfig.useDemoData && !process.env.DATABASE_URL) {
    errors.push('DATABASE_URL environment variable is required when using real database');
  }
  
  if (errors.length > 0) {
    throw new Error(`Database configuration errors:\n${errors.join('\n')}`);
  }
}

// Database connection status
export function getDatabaseStatus() {
  return {
    mode: databaseConfig.useDemoData ? 'demo' : 'real',
    databaseUrl: databaseConfig.useDemoData ? 'N/A (demo mode)' : databaseConfig.prisma.databaseUrl,
    environment: process.env.NODE_ENV,
  };
} 