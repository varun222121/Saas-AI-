import 'dotenv/config';
import sql from './configs/db.js';

async function setupDatabase() {
    try {
        console.log('Creating creations table...');

        await sql`
            CREATE TABLE IF NOT EXISTS creations (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                prompt TEXT NOT NULL,
                content TEXT NOT NULL,
                type VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id)
        `;

        console.log('✓ Database setup completed successfully!');

        // Test the connection
        const result = await sql`SELECT COUNT(*) FROM creations`;
        console.log('✓ Current creations count:', result[0].count);

        process.exit(0);
    } catch (error) {
        console.error('✗ Database setup failed:', error.message);
        process.exit(1);
    }
}

setupDatabase();
