const db = require("./config/db");

(async () => {
    try {
        await db.query(`DROP TABLE IF EXISTS reports`);
        await db.query(`DROP TABLE IF EXISTS users`);

        await db.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'citizen',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE reports (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                image TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        console.log("✅ PostgreSQL tables created successfully.");
    } catch (error) {
        console.error("Error creating PostgreSQL tables:", error.message);
    } finally {
        process.exit(0);
    }
})();