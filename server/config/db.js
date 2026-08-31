const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/civic_reporting";

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database.");
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL client error:", err);
});

const db = {
    serialize(fn) {
        return Promise.resolve().then(fn);
    },

    get(sql, params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = [];
        }

        return pool.query(sql, params)
            .then((result) => {
                const row = result.rows[0] || null;
                if (callback) callback(null, row);
                return row;
            })
            .catch((err) => {
                if (callback) callback(err, null);
                throw err;
            });
    },

    all(sql, params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = [];
        }

        return pool.query(sql, params)
            .then((result) => {
                if (callback) callback(null, result.rows);
                return result.rows;
            })
            .catch((err) => {
                if (callback) callback(err, null);
                throw err;
            });
    },

    run(sql, params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = [];
        }

        return pool.query(sql, params)
            .then((result) => {
                const context = {
                    lastID: result.rows?.[0]?.id ?? null,
                    changes: result.rowCount ?? 0
                };

                if (callback) callback.call(context, null);
                return context;
            })
            .catch((err) => {
                const context = { lastID: null, changes: 0 };
                if (callback) callback.call(context, err);
                throw err;
            });
    },

    query(sql, params) {
        return pool.query(sql, params);
    }
};

module.exports = db;