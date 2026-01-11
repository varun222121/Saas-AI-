import 'dotenv/config';
import sql from './configs/db.js';

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

        // Test basic query
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✓ Database connected successfully!');
        console.log('Current time from DB:', result[0].current_time);

        // Check if creations table exists
        const tables = await sql`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `;
        console.log('\nTables in database:');
        tables.forEach(t => console.log('-', t.table_name));

        process.exit(0);
    } catch (error) {
        console.error('✗ Database connection failed:');
        console.error('Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testDatabase();
