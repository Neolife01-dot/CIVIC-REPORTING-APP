const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const candidates = [
    path.join(__dirname, "../database/civic.db"),
    path.join(process.cwd(), "database", "civic.db"),
    path.join("/tmp", "civic-reporting-app.db")
];

let dbPath = candidates[0];

for (const candidate of candidates) {
    try {
        const dir = path.dirname(candidate);
        fs.mkdirSync(dir, { recursive: true });
        fs.accessSync(dir, fs.constants.W_OK);
        dbPath = candidate;
        break;
    } catch (error) {
        // Try the next candidate
    }
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to Civic Reporting database:", dbPath);
    }
});

module.exports = db;