const multer = require("multer");
const path = require("path");
const db = require("./config/db");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = "civic_reporting_secret_key";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and WebP images are allowed"));
        }
    }
});
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Test Route
app.get("/", (req, res) => {

    res.json({
        message: "Welcome to Civic Reporting API 🚀"
    });

});

// Start Server
// Get all users
app.get("/api/users", (req, res) => {

    db.all("SELECT id, name, email, role, created_at FROM users", [], (err, rows) => {

        if (err) {
            console.error("Database error:", err.message);

            return res.status(500).json({
                error: "Failed to fetch users"
            });
        }

        res.json(rows);

    });

});
// Register a new citizen
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "Name, email and password are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            error: "Password must be at least 6 characters"
        });
    }

    try {
        // Check if email already exists
        db.get(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    console.error("Database error:", err.message);

                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                if (user) {
                    return res.status(409).json({
                        error: "Email already registered"
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Save user
                db.run(
                    `INSERT INTO users (name, email, password, role)
                     VALUES (?, ?, ?, ?)`,
                    [name, email, hashedPassword, "citizen"],
                    function (err) {

                        if (err) {
                            console.error("Registration error:", err.message);

                            return res.status(500).json({
                                error: "Failed to register user"
                            });
                        }

                        res.status(201).json({
                            message: "Registration successful",
                            user: {
                                id: this.lastID,
                                name,
                                email,
                                role: "citizen"
                            }
                        });
                    }
                );
            }
        );

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: "Server error"
        });
    }
});
// Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                console.error("Login database error:", err.message);

                return res.status(500).json({
                    error: "Database error"
                });
            }

            if (!user) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
});
// Get all reports
app.get("/api/reports", (req, res) => {
    const sql = `
        SELECT *
        FROM reports
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({
                error: "Failed to fetch reports"
            });
        }

        res.json({
            reports: rows
        });
    });
});
// Get a single report by ID
app.get("/api/reports/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT *
        FROM reports
        WHERE id = ?
    `;

    db.get(sql, [id], (err, report) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({
                error: "Failed to fetch report"
            });
        }

        if (!report) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        res.json({
            report
        });
    });
});

// Update report status
app.patch("/api/reports/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "in progress", "resolved"];

    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
            error: "Invalid status. Use pending, in progress, or resolved."
        });
    }

    db.run(
        `UPDATE reports SET status = ? WHERE id = ?`,
        [status.toLowerCase(), id],
        function (err) {

            if (err) {
                console.error("Database error:", err.message);

                return res.status(500).json({
                    error: "Failed to update report status"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Report not found"
                });
            }

            res.json({
                message: "Report status updated successfully",
                report: {
                    id: Number(id),
                    status: status.toLowerCase()
                }
            });
        }
    );
});

// Create a new civic report
app.post("/api/reports", (req, res) => {
    const {
        user_id,
        title,
        description,
        category,
        location,
        image
    } = req.body;

    if (!user_id || !title || !description || !category || !location) {
        return res.status(400).json({
            error: "User, title, description, category and location are required"
        });
    }

    const sql = `
        INSERT INTO reports
        (user_id, title, description, category, location, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            user_id,
            title,
            description,
            category,
            location,
            image || null,
            "pending"
        ],
        function (err) {

            if (err) {
                console.error("Report creation error:", err.message);

                return res.status(500).json({
                    error: "Failed to submit report"
                });
            }

            res.status(201).json({
                message: "Report submitted successfully",
                report: {
                    id: this.lastID,
                    user_id,
                    title,
                    description,
                    category,
                    location,
                    image: image || null,
                    status: "pending"
                }
            });
        }
    );
});
app.post("/api/upload", upload.single("image"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            error: "No image uploaded"
        });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
        message: "Image uploaded successfully",
        image: imageUrl
    });
});

// Update report status
app.put("/api/reports/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "pending",
        "under review",
        "resolved"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            error: "Invalid status"
        });
    }

    const sql = `
        UPDATE reports
        SET status = ?
        WHERE id = ?
    `;

    db.run(sql, [status, id], function (err) {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to update report status"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        res.json({
            message: "Report status updated successfully"
        });
    });
});

// Initialize database tables on startup
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Check if users table exists
            db.get(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
                (err, row) => {
                    if (err) {
                        console.error("Database check error:", err.message);
                        reject(err);
                        return;
                    }

                    if (!row) {
                        // Users table doesn't exist, create both tables
                        console.log("📦 Initializing database tables...");

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
                                reject(err);
                                return;
                            }
                            console.log("✅ Users table created successfully.");

                            // Create reports table
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
                                    reject(err);
                                    return;
                                }
                                console.log("✅ Reports table created successfully.");
                                resolve();
                            });
                        });
                    } else {
                        console.log("✅ Database tables already exist.");
                        resolve();
                    }
                }
            );
        });
    });
}

// Start server after database initialization
initializeDatabase()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to initialize database:", error.message);
        process.exit(1);
    });