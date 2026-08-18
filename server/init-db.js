const db = require("./config/db");

db.serialize(() => {

    // Recreate users table
    db.run(`DROP TABLE IF EXISTS users`, (err) => {
        if (err) {
            console.error("Error dropping users table:", err.message);
            return;
        }

        db.run(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'citizen',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Error creating users table:", err.message);
            } else {
                console.log("✅ Users table created successfully.");
            }
        });
    });

    // Recreate reports table
    db.run(`DROP TABLE IF EXISTS reports`, (err) => {
        if (err) {
            console.error("Error dropping reports table:", err.message);
            return;
        }

        db.run(`
            CREATE TABLE reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                image TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error("Error creating reports table:", err.message);
            } else {
                console.log("✅ Reports table created successfully.");
            }
        });
    });

});