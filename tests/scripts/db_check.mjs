#!/usr/bin/env node

import { Client } from 'pg';
import { URL } from 'url';

const databaseUrl = process.env.DATABASE_URL;
const runWriteTest = process.env.RUN_DB_WRITE_TEST === 'true';

if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
}

async function testDatabase() {
    const client = new Client({
        connectionString: databaseUrl,
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Database connection established');

        // Basic read test
        console.log('📖 Testing read operations...');
        const result = await client.query('SELECT 1 as test');
        if (result.rows[0].test === 1) {
            console.log('✅ Read test passed');
        } else {
            throw new Error('Read test failed');
        }

        // Optional write test
        if (runWriteTest) {
            console.log('✏️  Testing write operations...');
            
            const tableName = `ci_test_${Date.now()}`;
            
            // Create temporary table
            await client.query(`
                CREATE TEMPORARY TABLE ${tableName} (
                    id SERIAL PRIMARY KEY,
                    test_data TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `);
            console.log('✅ Temporary table created');

            // Insert test data
            await client.query(`
                INSERT INTO ${tableName} (test_data) VALUES ('ci_test_data')
            `);
            console.log('✅ Test data inserted');

            // Verify data
            const selectResult = await client.query(`
                SELECT test_data FROM ${tableName} WHERE test_data = 'ci_test_data'
            `);
            
            if (selectResult.rows.length === 1) {
                console.log('✅ Test data verified');
            } else {
                throw new Error('Write test verification failed');
            }

            // Clean up
            await client.query(`DROP TABLE ${tableName}`);
            console.log('✅ Temporary table cleaned up');
            
            console.log('✅ Write test passed');
        } else {
            console.log('⏭️  Write test skipped (RUN_DB_WRITE_TEST=false)');
        }

        console.log('✅ Database connectivity test completed successfully');

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

testDatabase();