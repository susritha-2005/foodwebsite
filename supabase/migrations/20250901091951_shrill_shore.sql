/*
  # Seed Menu Data

  1. Purpose
    - Populate the menu_items table with authentic Indian dishes
    - Include variety of categories: starters, main courses, breads, desserts, beverages
    - Set appropriate pricing in Indian Rupees
    - Include detailed ingredient information and spice levels

  2. Categories
    - Starters: Appetizers and snacks
    - Main Course: Primary dishes with rice and curries
    - Breads: Traditional Indian breads
    - Desserts: Sweet treats
    - Beverages: Drinks and refreshments

  3. Data Structure
    - All items include proper categorization
    - Vegetarian/non-vegetarian classification
    - Spice level indicators
    - Realistic preparation times
    - High-quality food images from Pexels
*/

-- Insert menu items
INSERT INTO menu_items (id, name, description, price, category, image, is_veg, is_available, ingredients, spice_level, preparation_time) VALUES

-- Main Courses
('1', 'Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces, aromatic spices, and fresh herbs', 320, 'main-course', 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg', false, true, '["chicken", "tomatoes", "cream", "butter", "garam masala"]', 'medium', 25),

('2', 'Paneer Tikka Masala', 'Grilled cottage cheese cubes in rich, spiced gravy with bell peppers and onions', 280, 'main-course', 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg', true, true, '["paneer", "bell peppers", "onions", "tomatoes", "yogurt"]', 'medium', 20),

('3', 'Biryani (Chicken)', 'Fragrant basmati rice layered with spiced chicken, saffron, and fresh mint', 380, 'main-course', 'https://images.pexels.com/photos/6416470/pexels-photo-6416470.jpeg', false, true, '["basmati rice", "chicken", "saffron", "yogurt", "mint"]', 'spicy', 45),

('4', 'Dal Makhani', 'Slow-cooked black lentils in rich, creamy gravy with butter and cream', 220, 'main-course', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', true, true, '["black lentils", "cream", "butter", "tomatoes", "ginger"]', 'mild', 30),

-- Starters
('5', 'Chicken Tikka', 'Juicy chicken pieces marinated in yogurt and spices, grilled to perfection', 240, 'starters', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', false, true, '["chicken", "yogurt", "ginger-garlic paste", "red chili powder"]', 'medium', 15),

('6', 'Samosa (2 pieces)', 'Crispy fried pastries stuffed with spiced potatoes and peas', 80, 'starters', 'https://images.pexels.com/photos/5560052/pexels-photo-5560052.jpeg', true, true, '["potatoes", "peas", "cumin seeds", "coriander", "flour"]', 'mild', 10),

-- Breads
('7', 'Garlic Naan', 'Soft, fluffy bread topped with fresh garlic and herbs, baked in tandoor', 60, 'breads', 'https://images.pexels.com/photos/5560720/pexels-photo-5560720.jpeg', true, true, '["flour", "yogurt", "garlic", "butter", "herbs"]', 'mild', 8),

('8', 'Chapati (2 pieces)', 'Traditional whole wheat flatbread, soft and freshly made', 30, 'breads', 'https://images.pexels.com/photos/5560720/pexels-photo-5560720.jpeg', true, true, '["whole wheat flour", "water", "salt"]', 'mild', 5),

-- Desserts
('9', 'Gulab Jamun (4 pieces)', 'Soft, spongy milk dumplings soaked in sweet rose-flavored syrup', 120, 'desserts', 'https://images.pexels.com/photos/6416673/pexels-photo-6416673.jpeg', true, true, '["milk powder", "flour", "sugar", "rose water", "cardamom"]', 'mild', 12),

-- Beverages
('10', 'Masala Chai', 'Traditional Indian spiced tea with milk, cardamom, and ginger', 40, 'beverages', 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg', true, true, '["tea leaves", "milk", "cardamom", "ginger", "sugar"]', 'mild', 5),

('11', 'Mango Lassi', 'Refreshing yogurt-based drink blended with fresh mango and cardamom', 80, 'beverages', 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg', true, true, '["yogurt", "mango", "sugar", "cardamom", "ice"]', 'mild', 3)

ON CONFLICT (id) DO NOTHING;