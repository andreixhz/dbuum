import { randomUUIDv7, sql, SQL } from "bun";
import fs from 'fs';
import type { Migration } from "./types";
import { 
    saveInsertedIds, 
    convertData, 
    makeInsertQuery, 
    extractionQuery, 
    formatAnalytics
} from "./src/utils";
import { configManager } from "./src/config";
import { logger, LogLevel } from "./src/logger";
import { errorHandler, ErrorType } from "./src/errorHandler";

const args = process.argv.slice(2);
const configFile = args[0];

if (!configFile) {
    logger.error('Config file is required');
    process.exit(1);
}

try {
    // Load and validate configuration
    const config = configManager.loadFromFile(configFile);
    
    // Configure logging
    const loggingConfig = configManager.getLoggingConfig();
    logger.setLevel(LogLevel.DEBUG); // Force DEBUG level for troubleshooting
    if (loggingConfig.file) {
        logger.setLogFile(loggingConfig.file);
    }

    logger.info('Starting migration process', { configFile });
} catch (error) {
    logger.error('Failed to load configuration', { error: error instanceof Error ? error.message : 'Unknown error' });
    process.exit(1);
}

const sourceConfig = configManager.getSourceConfig();
const targetConfig = configManager.getTargetConfig();
const migrations: Migration[] = configManager.getMigrations();
const checkpointConfig = configManager.getCheckpointConfig();

logger.info('Creating database connections...', { 
    source: { ...sourceConfig, password: '***' }, 
    target: { ...targetConfig, password: '***' } 
});

const source = new SQL({
    ...sourceConfig,
    adapter: sourceConfig.adapter as "postgres" | "mysql" | "mariadb"
});

const target = new SQL({
    ...targetConfig,
    adapter: targetConfig.adapter as "postgres" | "mysql" | "mariadb"
});

logger.info('Database connections created successfully');

// Test database connections
async function testConnections() {
    try {
        logger.info('Testing source database connection...');
        const sourceTest = await Promise.race([
            source.unsafe('SELECT 1 as test'),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Source connection timeout after 10 seconds')), 10000)
            )
        ]);
        logger.info('Source database connection successful', { result: sourceTest });
    } catch (error) {
        logger.error('Source database connection failed', { 
            error: error instanceof Error ? error.message : 'Unknown error',
            config: sourceConfig 
        });
        throw error;
    }

    try {
        logger.info('Testing target database connection...');
        const targetTest = await Promise.race([
            target.unsafe('SELECT 1 as test'),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Target connection timeout after 10 seconds')), 10000)
            )
        ]);
        logger.info('Target database connection successful', { result: targetTest });
    } catch (error) {
        logger.error('Target database connection failed', { 
            error: error instanceof Error ? error.message : 'Unknown error',
            config: targetConfig 
        });
        throw error;
    }
}

async function processMigration(migration: Migration) {
    logger.info(`Processing migration: ${migration.name}`);
    
    try {
        if (!fs.existsSync(checkpointConfig.file)) {
            fs.writeFileSync(checkpointConfig.file, JSON.stringify([], null, 2));
        }

        const checkpoint = fs.readFileSync(checkpointConfig.file, 'utf8');
        const checkpointData = JSON.parse(checkpoint);

        const checkpointObject = checkpointData.reduce((acc: any, id: any) => {
            acc[id] = true;
            return acc;
        }, {});

        const extractionQueryStr = extractionQuery(migration);
        logger.debug(`Executing extraction query: ${extractionQueryStr}`);
        
        let query;
        try {
            query = await source.unsafe(extractionQueryStr);
            logger.info(`Query executed successfully, returned ${query.length} rows`);
        } catch (error) {
            errorHandler.handleDatabaseError(error as Error, extractionQueryStr, { migration: migration.name });
            logger.error(`Database query failed for migration: ${migration.name}`, { 
                error: error instanceof Error ? error.message : 'Unknown error',
                query: extractionQueryStr 
            });
            return; // Skip this migration
        }

        const convertedData = query.filter((data: any) => !checkpointObject[data[migration.columns.find(column => column.primary)?.column as string]]
        ).map((data: any) => convertData(data, migration));
        
        logger.info(`After filtering and conversion: ${convertedData.length} rows`);

        const startTime = Date.now();
        logger.info(`Converted ${convertedData.length} rows for migration: ${migration.name}`);

        let analytics = {
            name: migration.name,
            inserted: 0,
            total: convertedData.length,
            time: 0,
            error: 0,
            success: 0,
            errorIds: [] as any[],
        }

        let last100Times: number[] = [];

        for (const data of convertedData) {
            console.log(formatAnalytics(analytics, last100Times.reduce((a, b) => a + b, 0) / last100Times.length));

            const initialTime = Date.now();
            
            try {
                const query = makeInsertQuery(data, migration);
                await target.unsafe(query);

                const primaryColumn = migration.columns.find(column => column.primary);
                if (primaryColumn) {
                    saveInsertedIds(data[primaryColumn.column], checkpointConfig.file);
                }
                analytics.inserted++;
                analytics.success++;

            } catch (error) {
                analytics.error++;
                analytics.errorIds.push(data.id);
                errorHandler.handleMigrationError(error as Error, migration.name, { data });
            }

            if (last100Times.length < 100) {
                last100Times.push(Date.now() - initialTime);
            }

            analytics.time = Date.now() - startTime;
        }

        logger.info(`Migration completed: ${migration.name}`, {
            inserted: analytics.inserted,
            errors: analytics.error,
            total: analytics.total,
            duration: analytics.time
        });

    } catch (error) {
        errorHandler.handleMigrationError(error as Error, migration.name);
        logger.error(`Migration failed: ${migration.name}`, { error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

// Main execution loop
async function main() {
    try {
        // Test database connections first
        await testConnections();
        
        for (const migration of migrations) {
            await processMigration(migration);
        }
        
        logger.info('All migrations completed successfully');
        
        const errorSummary = errorHandler.getErrorSummary();
        const totalErrors = Object.values(errorSummary).reduce((sum, count) => sum + count, 0);
        
        if (totalErrors > 0) {
            logger.warn('Migration completed with errors', { errorSummary });
        } else {
            logger.info('Migration completed without errors');
        }
        
    } catch (error) {
        errorHandler.handle(error as Error);
        logger.error('Fatal error during migration process', { error: error instanceof Error ? error.message : 'Unknown error' });
        process.exit(1);
    }
}

// Execute main function
main();