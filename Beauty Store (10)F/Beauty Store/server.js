const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./database/connection');

// Import routes
const adminRoutes = require('./routes/admin');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files with cache headers are configured below (line ~555)

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// ===== HTML PAGE ROUTES =====

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'products.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'cart.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'admin-dashboard.html'));
});

app.get('/product-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'product-details.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'checkout.html'));
});

app.get('/order-confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'order.html'));
});

app.get('/order-tracking', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'order-tracking.html'));
});
// Add categories route to server.js
app.get('/categories', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'categories.html'));
});

// Contact page route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'contact.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'about.html'));
});

// ===== VIDEO STREAMING WITH RANGE SUPPORT =====
app.get('/Images/video/:filename', (req, res) => {
    const videoPath = path.join(__dirname, 'public', 'Images', 'video', req.params.filename);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send('Video not found');
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        // Parse range header
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
            'Cache-Control': 'public, max-age=86400'
        };
        
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        // No range header, send entire file
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=86400'
        };
        
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

// ===== API ROUTES =====

// Use admin routes
app.use('/api/admin', adminRoutes);

// Permanent registration endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        console.log('Registration attempt for:', email);

        // Check if user exists
        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const result = await db.query(
            'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, role',
            [email, hashedPassword, firstName, lastName]
        );

        const user = result.rows[0];

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'beauty_supply_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                initials: (user.first_name[0] + user.last_name[0]).toUpperCase()
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Permanent login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for:', email);

        // Find user in database
        const result = await db.query(
            'SELECT id, email, password, first_name, last_name, role FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'beauty_supply_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                initials: (user.first_name[0] + user.last_name[0]).toUpperCase()
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Products API
// Enhanced Products API with better search
app.get('/api/products', async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
        `;
        let params = [];
        let conditions = [];

        if (search) {
            // Enhanced search with better ranking
            conditions.push(`(
                p.name ILIKE $${conditions.length + 1} OR
                p.name ILIKE $${conditions.length + 2} OR
                p.description ILIKE $${conditions.length + 3} OR
                p.brand ILIKE $${conditions.length + 4} OR
                c.name ILIKE $${conditions.length + 5} OR
                p.tags::text ILIKE $${conditions.length + 6}
            )`);
            params.push(`%${search}%`, `${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (category) {
            conditions.push(`c.name ILIKE $${conditions.length + 1}`);
            params.push(`%${category}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Better ordering for search results
        if (search) {
            query += ` 
                ORDER BY 
                    CASE 
                        WHEN p.name ILIKE $${params.length - 5} THEN 1
                        WHEN p.brand ILIKE $${params.length - 5} THEN 2
                        WHEN c.name ILIKE $${params.length - 5} THEN 3
                        ELSE 4
                    END,
                    p.name
            `;
        } else {
            query += ' ORDER BY p.created_at DESC';
        }

        console.log('Search query:', search, 'Results params:', params);
        const result = await db.query(query, params);
        console.log('Found products:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

app.get('/api/products/featured', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.is_featured = true 
            ORDER BY p.created_at DESC 
            LIMIT 8
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Featured products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Product detail error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Product details route - FIXED
app.get('/product-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'product-details.html'));
});
// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email required' });
        }
        
        // Store in database (you'll need to create a newsletter_subscriptions table)
        await db.query(
            'INSERT INTO newsletter_subscriptions (email, subscribed_at) VALUES ($1, CURRENT_TIMESTAMP) ON CONFLICT (email) DO NOTHING',
            [email]
        );
        
        // Here you would integrate with your SMTP service
        // For now, we'll just log it
        console.log(`New newsletter subscription: ${email}`);
        
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// Cart API
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = $1
        `, [req.user.userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Check if product exists
        const productResult = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if item already in cart
        const existingCartItem = await db.query(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [req.user.userId, productId]
        );

        if (existingCartItem.rows.length > 0) {
            // Update quantity
            await db.query(
                'UPDATE cart SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
                [quantity, req.user.userId, productId]
            );
        } else {
            // Add new item
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [req.user.userId, productId, quantity]
            );
        }

        res.json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (quantity < 1) {
            await db.query(
                'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
                [req.user.userId, req.params.productId]
            );
        } else {
            await db.query(
                'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
                [quantity, req.user.userId, req.params.productId]
            );
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
            [req.user.userId, req.params.productId]
        );

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cart', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE user_id = $1', [req.user.userId]);
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        await db.query('SELECT 1');
        res.json({ 
            status: 'OK', 
            message: 'Server and database are running!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});


// Smart search suggestions endpoint
// Smart search suggestions endpoint
app.get('/api/search/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json([]);
        }

        // Get product name suggestions
        const productSuggestions = await db.query(`
            SELECT name 
            FROM products 
            WHERE name ILIKE $1 
            GROUP BY name
            ORDER BY 
                CASE 
                    WHEN name ILIKE $2 THEN 1
                    ELSE 2
                END,
                name
            LIMIT 5
        `, [`%${q}%`, `${q}%`]);

        // Get category suggestions
        const categorySuggestions = await db.query(`
            SELECT name 
            FROM categories 
            WHERE name ILIKE $1 
            GROUP BY name
            LIMIT 3
        `, [`%${q}%`]);

        // Get brand suggestions
        const brandSuggestions = await db.query(`
            SELECT brand 
            FROM products 
            WHERE brand ILIKE $1 
            GROUP BY brand
            LIMIT 3
        `, [`%${q}%`]);

        const suggestions = [
            ...productSuggestions.rows.map(row => ({ type: 'product', text: row.name })),
            ...categorySuggestions.rows.map(row => ({ type: 'category', text: row.name + ' products' })),
            ...brandSuggestions.rows.map(row => ({ type: 'brand', text: row.brand + ' products' }))
        ];

        // Remove duplicates and limit
        const uniqueSuggestions = [];
        const seen = new Set();
        
        for (const suggestion of suggestions) {
            if (!seen.has(suggestion.text) && uniqueSuggestions.length < 8) {
                uniqueSuggestions.push(suggestion);
                seen.add(suggestion.text);
            }
        }

        res.json(uniqueSuggestions);
    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
});
// Simple in-memory API cache (path+query key)
const __apiCache = new Map();
function cacheKey(req) {
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  url.searchParams.sort();
  return `${req.method}:${url.pathname}?${url.searchParams.toString()}`;
}
function cacheGet(ttlMs) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = cacheKey(req);
    const now = Date.now();
    const hit = __apiCache.get(key);
    if (hit && hit.expiresAt > now) {
      res.set(hit.headers || {});
      return res.status(hit.status || 200).send(hit.body);
    }
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      try {
        __apiCache.set(key, {
          body,
          status: res.statusCode,
          headers: {
            'Cache-Control': `public, max-age=${Math.floor(ttlMs/1000)}`
          },
          expiresAt: now + ttlMs
        });
        res.set('Cache-Control', `public, max-age=${Math.floor(ttlMs/1000)}`);
      } catch { /* ignore cache store errors */ }
      return originalSend(body);
    };
    next();
  };
}
function clearApiCacheByPrefix(prefixPath) {
  for (const key of __apiCache.keys()) {
    if (key.includes(`:${prefixPath}`)) {
      __apiCache.delete(key);
    }
  }
}

// Enhance static file caching headers
const ONE_YEAR = 31536000; // seconds
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    const p = filePath.toLowerCase();
    if (p.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (p.match(/\.(mp4|webm|ogg)$/)) {
      // Videos need different caching to support streaming
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      res.setHeader('Accept-Ranges', 'bytes'); // Enable range requests for video streaming
    } else if (p.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/)) {
      res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
    }
  }
}));

// Start server
app.listen(PORT, () => {
    console.log(`🎉 Beauty Supply Store running on http://localhost:${PORT}`);
    console.log(`✅ Server started successfully at ${new Date().toLocaleTimeString()}`);
    console.log(`📋 Available Routes:`);
    console.log(`   - http://localhost:${PORT}/ (Homepage)`);
    console.log(`   - http://localhost:${PORT}/login (Login Page)`);
    console.log(`   - http://localhost:${PORT}/products (Products Page)`);
    console.log(`   - http://localhost:${PORT}/cart (Cart Page)`);
    console.log(`   - http://localhost:${PORT}/admin-dashboard (Admin Dashboard)`);
    console.log(`   - http://localhost:${PORT}/api/health (Health Check)`);
    console.log(`   - http://localhost:${PORT}/api/admin/* (Admin API Routes)`);
});

// Add profile route
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});

// Customer orders API
app.get('/api/customer/orders', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*, 
                   COUNT(oi.id) as item_count,
                   JSON_AGG(
                       JSON_BUILD_OBJECT(
                           'id', oi.id,
                           'product_id', oi.product_id,
                           'product_name', p.name,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'image_url', p.image_url
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.user.userId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/customer/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;
        
        const result = await db.query(`
            UPDATE users 
            SET first_name = $1, last_name = $2, phone = $3, address = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, email, first_name, last_name, phone, address, role
        `, [firstName, lastName, phone, address, req.user.userId]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Orders API
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const {
            id,
            userId,
            items,
            totals,
            shipping,
            payment,
            status
        } = req.body;

        // Save order to database
        const orderResult = await db.query(`
            INSERT INTO orders (order_number, user_id, total_amount, status, shipping_address, payment_method, payment_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [id, userId, totals.total, status, JSON.stringify(shipping), payment.method, payment.status]);

        const order = orderResult.rows[0];

        // Save order items
        for (const item of items) {
            await db.query(`
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
            `, [order.id, item.id, item.quantity, item.price]);
        }

        // Save bank transfer details if applicable
        if (payment.method === 'bank_transfer') {
            await db.query(`
                INSERT INTO bank_transfers (order_id, bank_name, transaction_reference, status)
                VALUES ($1, $2, $3, $4)
            `, [order.id, payment.bank, payment.transactionRef, 'pending_review']);
        }

        res.status(201).json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get orders for admin
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*, 
                   u.first_name, 
                   u.last_name, 
                   u.email,
                   bt.bank_name,
                   bt.transaction_reference,
                   bt.status as payment_status
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN bank_transfers bt ON o.id = bt.order_id
            ORDER BY o.created_at DESC
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public lookup by order number and email (no auth)
app.get('/api/orders/lookup', async (req, res) => {
    try {
        const orderNumber = String(req.query.order_number || '').trim();
        const email = String(req.query.email || '').trim().toLowerCase();

        if (!orderNumber) {
            return res.status(400).json({ error: 'order_number is required' });
        }

        let result;
        if (email) {
            result = await db.query(`
                SELECT 
                    o.id,
                    o.order_number,
                    o.total_amount,
                    o.status,
                    o.created_at,
                    COALESCE(MAX(bt.status), o.payment_status) AS payment_status,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'price', oi.price,
                            'name', p.name,
                            'image_url', p.image_url
                        )
                    ) AS items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.id
                LEFT JOIN bank_transfers bt ON o.id = bt.order_id
                LEFT JOIN users u ON o.user_id = u.id
                WHERE UPPER(TRIM(o.order_number)) = UPPER(TRIM($1))
                  AND (
                        LOWER(u.email) = $2
                     OR LOWER(COALESCE(o.shipping_address->>'email', '')) = $2
                  )
                GROUP BY o.id
                LIMIT 1
            `, [orderNumber, email]);
        } else {
            result = await db.query(`
                SELECT 
                    o.id,
                    o.order_number,
                    o.total_amount,
                    o.status,
                    o.created_at,
                    COALESCE(MAX(bt.status), o.payment_status) AS payment_status,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'price', oi.price,
                            'name', p.name,
                            'image_url', p.image_url
                        )
                    ) AS items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.id
                LEFT JOIN bank_transfers bt ON o.id = bt.order_id
                WHERE UPPER(TRIM(o.order_number)) = UPPER(TRIM($1))
                GROUP BY o.id
                LIMIT 1
            `, [orderNumber]);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Order lookup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update order status (approve/deny)
app.put('/api/admin/orders/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_status } = req.body;

        const result = await db.query(`
            UPDATE orders 
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `, [status, id]);

        if (payment_status) {
            await db.query(`
                UPDATE bank_transfers 
                SET status = $1, updated_at = CURRENT_TIMESTAMP
                WHERE order_id = $2
            `, [payment_status, id]);
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});app.get('/bank', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'bank.html'));
});

// Add this route to your server.js file
app.get('/api/products/random', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        
        const result = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.is_active = true 
            AND p.stock_quantity > 0
            ORDER BY RANDOM()
            LIMIT $1
        `, [limit]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Random products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add API endpoint to fetch orders for a logged-in user
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(`
            SELECT 
                o.id, 
                o.order_number, 
                o.total_amount, 
                o.status, 
                o.created_at,
                COALESCE(bt.status, o.payment_status) AS payment_status,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'name', p.name,
                        'image_url', p.image_url
                    )
                ) AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN bank_transfers bt ON o.id = bt.order_id
            WHERE o.user_id = $1
            GROUP BY o.id, bt.status
            ORDER BY o.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});