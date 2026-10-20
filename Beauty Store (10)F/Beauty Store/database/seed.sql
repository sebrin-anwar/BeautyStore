-- ===================================================================
-- Beauty Supply Store Seed Data
-- This file contains indexes, triggers, users, and sample orders
-- Run this after schema.sql and seed-products.sql
-- ===================================================================

-- Connect to the database
\c beautysupplystore;

-- ===================================================================
-- INDEXES
-- ===================================================================

-- Product indexes for better query performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = true;

-- Order indexes for better query performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_bank_transfers_order_id ON bank_transfers(order_id);

-- ===================================================================
-- TRIGGERS AND FUNCTIONS
-- ===================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to update timestamps on all tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_transfers_updated_at BEFORE UPDATE ON bank_transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- USERS (Admin and Demo Users)
-- ===================================================================

-- Insert admin user (password: admin123)
-- Password hash: $2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('admin@beautysupply.com', '$2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert demo customer (password: customer123)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('customer@beautysupply.com', '$2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W', 'Demo', 'Customer', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Insert additional demo users for testing
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('meti@gmail.com', '$2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W', 'Meti', 'Abera', '+251911223344', 'customer'),
('beti@gmail.com', '$2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W', 'Beti', 'Worku', '+251922334455', 'customer'),
('lozan@gmail.com', '$2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W', 'Lozan', 'Getnet', '+251933445566', 'customer'),
('melatxg@gmail.com', '$2b$10$KxG5.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9WO.5R2W3c9W2c9W2c9W', 'Melat', 'Getachew', '+251933845566', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ===================================================================
-- SAMPLE ORDERS (for testing purposes)
-- ===================================================================

-- Insert sample orders
INSERT INTO orders (order_number, user_id, total_amount, subtotal_amount, shipping_amount, tax_amount, discount_amount, status, shipping_address, payment_method, payment_status) VALUES
('ORD-001', 2, 2450.00, 2000.00, 150.00, 300.00, 0.00, 'completed', '{"firstName": "Meti", "lastName": "Abera", "email": "Meti@gmail.com", "phone": "+251911223344", "subcity": "Bole", "city": "Addis Ababa", "zipCode": "1000", "country": "Ethiopia"}', 'bank_transfer', 'paid'),
('ORD-002', 3, 3675.00, 3000.00, 0.00, 450.00, 225.00, 'processing', '{"firstName": "Beti", "lastName": "Worku", "email": "beti@gmail.com", "phone": "+251922334455", "subcity": "Kirkos", "city": "Addis Ababa", "zipCode": "1000", "country": "Ethiopia"}', 'bank_transfer', 'pending_review'),
('ORD-003', 2, 1725.00, 1500.00, 0.00, 225.00, 0.00, 'shipped', '{"firstName": "Meti", "lastName": "Abera", "email": "meti@gmail.com", "phone": "+251911223344", "subcity": "Bole", "city": "Addis Ababa", "zipCode": "1000", "country": "Ethiopia"}', 'bank_transfer', 'paid'),
('ORD-004', 4, 920.00, 800.00, 0.00, 120.00, 0.00, 'pending', '{"firstName": "Lozan", "lastName": "Getnet", "email": "lozan@gmail.com", "phone": "+251933445566", "subcity": "Arada", "city": "Addis Ababa", "zipCode": "1000", "country": "Ethiopia"}', 'bank_transfer', 'pending_review'),
('ORD-005', 5, 1840.00, 1600.00, 0.00, 240.00, 0.00, 'pending', '{"firstName": "Melat", "lastName": "Getachew", "email": "melatxg@gmail.com", "phone": "+251933845566", "subcity": "Yeka", "city": "Addis Ababa", "zipCode": "1000", "country": "Ethiopia"}', 'bank_transfer', 'pending_review');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 1156.00),
(1, 2, 1, 1003.00),
(2, 3, 3, 986.00),
(2, 4, 1, 1224.00),
(3, 5, 2, 1343.00),
(3, 6, 1, 1666.00),
(4, 7, 1, 1309.00),
(5, 8, 2, 2038.00);

-- Insert bank transfers
INSERT INTO bank_transfers (order_id, bank_name, transaction_reference, status) VALUES
(1, 'Commercial Bank of Ethiopia', 'CBE2024001', 'approved'),
(2, 'Dashen Bank', 'DSH2024002', 'pending_review'),
(3, 'Awash Bank', 'AWS2024003', 'approved'),
(4, 'Bank of Abyssinia', 'BOA2024004', 'pending_review'),
(5, 'Commercial Bank of Ethiopia', 'CBE2024005', 'pending_review');

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Verify everything was inserted correctly
SELECT 'Database seeding completed!' as status;

-- Show summary statistics
SELECT 'Summary Statistics:' as info;
SELECT 
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM order_items) as total_order_items;
