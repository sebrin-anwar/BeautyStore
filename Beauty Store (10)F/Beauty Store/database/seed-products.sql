-- ===================================================================
-- Beauty Supply Store Product Data
-- This file contains category and product INSERT statements
-- Run this after schema.sql
-- ===================================================================

-- Connect to the database first
\c beautysupplystore;

-- ===================================================================
-- CATEGORIES
-- ===================================================================

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Skincare', 'Face and body skincare products including cleansers, serums, moisturizers and treatments'),
('Makeup', 'Cosmetics and makeup products including foundation, lipstick, eyeshadow and more'),
('Hair Care', 'Hair treatment, shampoo, conditioner and styling products'),
('Fragrance', 'Perfumes, body mists and scented body care products');

-- ===================================================================
-- PRODUCTS
-- ===================================================================

-- Insert Skincare Products (category_id: 1)
INSERT INTO products (name, description, price, compare_price, brand, category_id, stock_quantity, has_shades, image_url) VALUES
-- The Ordinary
('The Ordinary Hyaluronic Acid 2% + B5', 'Hydration support formula with ultra-pure, vegan hyaluronic acid', 1156, 1360, 'The Ordinary', 1, 45, false, '/images/products/ordinary-ha.jpg'),
('The Ordinary Niacinamide 10% + Zinc 1%', 'Oil control and blemish formula with high-strength vitamin and mineral', 1003, 1190, 'The Ordinary', 1, 38, false, '/images/products/ordinary-niacinamide.jpg'),
('The Ordinary Vitamin C Suspension 23% + HA Spheres 2%', 'Brightening formula with pure L-ascorbic acid powder', 986, 1156, 'The Ordinary', 1, 52, false, '/images/products/ordinary-vitaminc.jpg'),
('The Ordinary AHA 30% + BHA 2% Peeling Solution', 'Exfoliating facial with alpha-hydroxy and beta-hydroxy acids', 1224, 1445, 'The Ordinary', 1, 27, false, '/images/products/ordinary-peeling.jpg'),
('The Ordinary 100% Plant-Derived Squalane', 'Lightweight moisturizing oil derived from plant sugars', 1343, 1564, 'The Ordinary', 1, 41, false, '/images/products/ordinary-squalane.jpg'),
('The Ordinary 100% Organic Cold-Pressed Rose Hip Seed Oil', 'Regenerative oil rich in antioxidants and essential fatty acids', 1666, 1955, 'The Ordinary', 1, 36, false, '/images/products/ordinary-rosehip.jpg'),
('The Ordinary Natural Moisturizing Factors + HA', 'Daily support cream with amino acids and hyaluronic acid', 1309, 1530, 'The Ordinary', 1, 49, false, '/images/products/ordinary-moisturizer.jpg'),

-- Cetaphil
('Cetaphil Gentle Skin Cleanser', 'Daily face wash for sensitive skin, soap-free formula', 2038, 2549, 'Cetaphil', 1, 68, false, '/images/products/cetaphil-cleanser.jpg'),
('Cetaphil Pro DermaControl Foam Wash', 'Oil-removing foaming cleanser for acne-prone skin', 2295, 2720, 'Cetaphil', 1, 55, false, '/images/products/cetaphil-foamwash.jpg'),
('Cetaphil Daily Facial Cleanser', 'Gentle cleanser for normal to oily skin types', 1868, 2208, 'Cetaphil', 1, 59, false, '/images/products/cetaphil-daily.jpg'),
('Cetaphil Moisturizing Cream', 'Rich body cream for very dry, sensitive skin', 2888, 3398, 'Cetaphil', 1, 73, false, '/images/products/cetaphil-cream.jpg'),
('Cetaphil Daily Advance Ultra Hydrating Lotion', 'Lightweight lotion for daily hydration', 2548, 3058, 'Cetaphil', 1, 62, false, '/images/products/cetaphil-lotion.jpg'),

-- Haru Haru Wonder
('Haru Haru Wonder Black Rice Hyaluronic Toner', 'Korean toner with black rice extract and hyaluronic acid', 3740, 4420, 'Haru Haru Wonder', 1, 38, false, '/images/products/haru-toner.jpg'),
('Haru Haru Wonder Black Rice Moisture Airy Fit Sunscreen', 'Lightweight chemical sunscreen with black rice extract', 4250, 5100, 'Haru Haru Wonder', 1, 42, false, '/images/products/haru-chemical.jpg'),
('Haru Haru Wonder Black Rice Moisture Sun Cream', 'Mineral sunscreen with nourishing black rice formula', 4590, 5440, 'Haru Haru Wonder', 1, 35, false, '/images/products/haru-mineral.jpg'),
('Haru Haru Wonder Black Rice Eye Cream', 'Nourishing eye cream with black rice and hyaluronic acid', 4930, 5950, 'Haru Haru Wonder', 1, 29, false, '/images/products/haru-eyecream.jpg'),

-- Round Lab
('Round Lab 1025 Dokdo Cleanser', 'Gentle Korean cleanser with deep sea water from Dokdo', 3060, 3740, 'Round Lab', 1, 45, false, '/images/products/dokdo-cleanser.jpg'),
('Round Lab 1025 Dokdo Toner', 'Hydrating toner with 1025 Dokdo island deep sea water', 3400, 4080, 'Round Lab', 1, 41, false, '/images/products/dokdo-toner.jpg'),
('Round Lab 1025 Dokdo Cream', 'Moisturizing cream with Dokdo deep sea water minerals', 3910, 4760, 'Round Lab', 1, 37, false, '/images/products/dokdo-cream.jpg'),
('Round Lab Birch Juice Moisturizing Sun Cream', 'Chemical sunscreen with birch juice hydration and SPF 50+', 4420, 5270, 'Round Lab', 1, 44, false, '/images/products/dokdo-spf.jpg');

-- Insert Makeup Products (category_id: 2)
INSERT INTO products (name, description, price, compare_price, brand, category_id, stock_quantity, has_shades, shades, image_url) VALUES
-- Fenty Beauty
('Fenty Beauty Pro Filt''r Soft Matte Longwear Foundation', 'Soft matte, longwear foundation with climate-adaptive technology', 6460, 7140, 'Fenty Beauty', 2, 32, true, '["110", "120", "130", "140", "150", "160", "170", "180", "190", "200", "210", "220", "230", "240", "250", "260", "270", "280", "290", "300", "310", "320", "330", "340", "350", "360", "370", "380", "390", "400", "410", "420", "430", "440", "450", "460", "470", "480", "490", "500"]', '/images/products/fenty-matte-foundation.jpg'),
('Fenty Beauty Pro Filt''r Hydrating Longwear Foundation', 'Hydrating longwear foundation for normal to dry skin', 6460, 7140, 'Fenty Beauty', 2, 28, true, '["100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195"]', '/images/products/fenty-hydrating-foundation.jpg'),
('Fenty Beauty Stunna Lip Paint', 'Longwear liquid lipstick with feather-light feel', 4250, 4760, 'Fenty Beauty', 2, 55, true, '["Uncensored", "Unveil", "Unbutton", "Uninvited"]', '/images/products/fenty-lip-paint.jpg'),
('Fenty Beauty Slip Shine Sheer Shiny Lipstick', 'Sheer shiny lipstick with nourishing formula', 3740, 4250, 'Fenty Beauty', 2, 42, true, '["Gloss Bomb", "Fenty Glow", "Fu$$y", "Sweet Mouth"]', '/images/products/fenty-slip-shine.jpg'),
('Fenty Beauty Mattemoiselle Plush Matte Lipstick', 'Ultra-plush matte lipstick with comfortable wear', 3400, 3910, 'Fenty Beauty', 2, 48, true, '["Freckle Fiesta", "Spanked", "Griselda", "Saw-C"]', '/images/products/fenty-matte-lipstick.jpg'),
('Fenty Beauty Flypencil Longwear Lip Liner', 'Longwear lip liner with smudge-proof formula', 3060, 3570, 'Fenty Beauty', 2, 45, true, '["Cuz I''m Black", "Spanked", "Yacht Lyfe", "Candy Venom", "Saw-C", "Griselda", "Tiger Tini", "Ma''Damn"]', '/images/products/fenty-lipliner.jpg'),
('Fenty Beauty Full Frontal Volume, Lift & Curl Mascara', 'Mascara that lifts, curls and adds volume from all angles', 4080, 4590, 'Fenty Beauty', 2, 51, false, NULL, '/images/products/fenty-mascara.jpg'),
('Fenty Beauty Killawatt Freestyle Highlighter', 'Duo highlighter with multiple finish options', 6120, 6800, 'Fenty Beauty', 2, 39, false, NULL, '/images/products/fenty-highlighter.jpg');

-- Insert Hair Care Products (category_id: 3)
INSERT INTO products (name, description, price, compare_price, brand, category_id, stock_quantity, has_shades, image_url) VALUES
-- Olaplex
('Olaplex No. 4 Bond Maintenance Shampoo', 'Reparative shampoo that strengthens and protects hair', 5100, 5950, 'Olaplex', 3, 34, false, '/images/products/olaplex-shampoo.jpg'),
('Olaplex No. 5 Bond Maintenance Conditioner', 'Reparative conditioner that moisturizes and strengthens', 5100, 5950, 'Olaplex', 3, 29, false, '/images/products/olaplex-conditioner.jpg'),
('Olaplex No. 3 Hair Perfector', 'At-home treatment that repairs damaged hair', 5100, 5950, 'Olaplex', 3, 41, false, '/images/products/olaplex-no3.jpg'),
('Olaplex No. 6 Bond Smoother', 'Leave-in cream that smooths and strengthens', 5100, 5950, 'Olaplex', 3, 26, false, '/images/products/olaplex-no6.jpg'),

-- Moroccanoil
('Moroccanoil Hydrating Shampoo', 'Moisturizing shampoo with argan oil for dry hair', 4590, 5440, 'Moroccanoil', 3, 45, false, '/images/products/moroccanoil-shampoo.jpg'),
('Moroccanoil Hydrating Conditioner', 'Moisturizing conditioner that detangles and softens', 4590, 5440, 'Moroccanoil', 3, 42, false, '/images/products/moroccanoil-conditioner.jpg'),
('Moroccanoil Treatment Oil', 'Original treatment oil for all hair types', 7990, 9180, 'Moroccanoil', 3, 51, false, '/images/products/moroccanoil-oil.jpg'),

-- Shiseido Fino
('Shiseido Fino Premium Touch Hair Mask', 'Intensive hair mask with deep conditioning formula', 2550, 3060, 'Shiseido', 3, 48, false, '/images/products/fino-mask.jpg'),
('Shiseido Fino Premium Touch Hair Oil', 'Hair oil that adds shine and controls frizz', 3060, 3740, 'Shiseido', 3, 36, false, '/images/products/fino-oil.jpg'),

-- OUAI
('OUAI Hair Oil', 'Lightweight hair oil that nourishes and repairs', 5440, 6460, 'OUAI', 3, 37, false, '/images/products/ouai-oil.jpg');

-- Insert Fragrance Products (category_id: 4)
INSERT INTO products (name, description, price, compare_price, brand, category_id, stock_quantity, has_shades, image_url) VALUES
-- Lush
('Lush Rose Jam Perfume', 'Floral perfume with rose absolute and lemon oil', 7650, 9350, 'Lush', 4, 23, false, '/images/products/lush-rosejam.jpg'),
('Lush Karma Perfume', 'Patchouli and orange perfume with earthy tones', 7650, 9350, 'Lush', 4, 21, false, '/images/products/lush-karma.jpg'),
('Lush Vanillary Perfume', 'Sweet vanilla perfume with jasmine and tonka', 7650, 9350, 'Lush', 4, 25, false, '/images/products/lush-vanillary.jpg'),
('Lush Twilight Body Spray', 'Lavender and tonka body spray for relaxing scent', 4250, 5100, 'Lush', 4, 31, false, '/images/products/lush-twilight.jpg'),

-- EOS Body Lotions
('EOS Vanilla Cashmere 24HR Moisture Body Lotion', '24-hour moisture body lotion with warm vanilla and cashmere scent', 1900, 2200, 'EOS', 4, 42, false, '/images/products/eos-vanilla.jpg'),
('EOS Coconut Waters 24HR Moisture Body Lotion', '24-hour moisture body lotion with tropical coconut water scent', 1850, 2150, 'EOS', 4, 45, false, '/images/products/eos-coconut.jpg'),
('EOS Pink Champagne 24HR Moisture Body Lotion', '24-hour moisture body lotion with sparkling pink champagne scent', 1920, 2250, 'EOS', 4, 38, false, '/images/products/eos-champagne.jpg'),
('EOS Fresh & Cozy 24HR Moisture Body Lotion', '24-hour moisture body lotion with fresh, cozy cotton scent', 1880, 2180, 'EOS', 4, 40, false, '/images/products/eos-fresh.jpg'),
('EOS Pistachio Cream 24HR Moisture Body Lotion', '24-hour moisture body lotion with rich pistachio cream scent', 1950, 2280, 'EOS', 4, 41, false, '/images/products/eos-pistachio.jpg'),
('EOS Strawberry Dream 24HR Moisture Body Lotion', '24-hour moisture body lotion with sweet strawberry dream scent', 1870, 2170, 'EOS', 4, 44, false, '/images/products/eos-strawberry.jpg'),
('EOS Jasmine Peach 24HR Moisture Body Lotion', '24-hour moisture body lotion with floral jasmine and peach scent', 1930, 2260, 'EOS', 4, 39, false, '/images/products/eos-jasmine.jpg'),
('EOS Pomegranate Raspberry 24HR Moisture Body Lotion', '24-hour moisture body lotion with fruity pomegranate raspberry scent', 1910, 2220, 'EOS', 4, 43, false, '/images/products/eos-pomegranate.jpg');
