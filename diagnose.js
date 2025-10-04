#!/usr/bin/env node

/**
 * Database Connection Diagnostic Tool
 * This script helps diagnose database connection issues
 */

import { SQL } from "bun";

const configs = [
    {
        name: "MariaDB Source",
        config: {
            adapter: "mariadb",
            host: "localhost",
            port: 3306,
            user: "nl_user",
            password: "123",
            database: "nl"
        }
    },
    {
        name: "PostgreSQL Target", 
        config: {
            adapter: "postgres",
            host: "localhost",
            port: 5432,
            user: "postgres",
            password: "postgres",
            database: "nl"
        }
    }
];

async function testConnection(name, config) {
    console.log(`\n🔍 Testing ${name}...`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    
    try {
        const db = new SQL(config);
        
        // Test basic connection
        console.log(`   ⏳ Testing basic connection...`);
        const result = await Promise.race([
            db.unsafe('SELECT 1 as test'),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
            )
        ]);
        
        console.log(`   ✅ Connection successful!`);
        console.log(`   📊 Test result:`, result);
        
        // Test if database exists
        try {
            const tables = await db.unsafe('SHOW TABLES');
            console.log(`   📋 Tables found: ${tables.length}`);
            if (tables.length > 0) {
                console.log(`   📝 Table names:`, tables.map(t => Object.values(t)[0]).join(', '));
            }
        } catch (err) {
            console.log(`   ⚠️  Could not list tables: ${err.message}`);
        }
        
    } catch (error) {
        console.log(`   ❌ Connection failed: ${error.message}`);
        
        // Provide specific troubleshooting tips
        if (error.message.includes('ECONNREFUSED')) {
            console.log(`   💡 Tip: Database server is not running or not accessible`);
            console.log(`   💡 Check if MariaDB/PostgreSQL is running on ${config.host}:${config.port}`);
        } else if (error.message.includes('Access denied')) {
            console.log(`   💡 Tip: Wrong username or password`);
            console.log(`   💡 Check credentials for user: ${config.user}`);
        } else if (error.message.includes('Unknown database')) {
            console.log(`   💡 Tip: Database '${config.database}' does not exist`);
            console.log(`   💡 Create the database or check the name`);
        } else if (error.message.includes('timeout')) {
            console.log(`   💡 Tip: Connection timeout - server might be overloaded or unreachable`);
        }
    }
}

async function main() {
    console.log('🔧 Database Connection Diagnostic Tool');
    console.log('=====================================');
    
    for (const { name, config } of configs) {
        await testConnection(name, config);
    }
    
    console.log('\n📋 Troubleshooting Checklist:');
    console.log('1. ✅ Are both MariaDB and PostgreSQL running?');
    console.log('2. ✅ Are the ports 3306 and 5432 accessible?');
    console.log('3. ✅ Do the databases exist?');
    console.log('4. ✅ Are the credentials correct?');
    console.log('5. ✅ Is there a firewall blocking the connections?');
    console.log('\n🚀 To start the databases:');
    console.log('   MariaDB: sudo systemctl start mariadb');
    console.log('   PostgreSQL: sudo systemctl start postgresql');
}

main().catch(console.error);
