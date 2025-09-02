import { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  // Main Courses
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces, aromatic spices, and fresh herbs',
    price: 320,
    category: 'main-course',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    isVeg: false,
    isAvailable: true,
    ingredients: ['chicken', 'tomatoes', 'cream', 'butter', 'garam masala'],
    spiceLevel: 'medium',
    preparationTime: 25
  },
  {
    id: '2',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese cubes in rich, spiced gravy with bell peppers and onions',
    price: 280,
    category: 'main-course',
    image: 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['paneer', 'bell peppers', 'onions', 'tomatoes', 'yogurt'],
    spiceLevel: 'medium',
    preparationTime: 20
  },
  {
    id: '3',
    name: 'Biryani (Chicken)',
    description: 'Fragrant basmati rice layered with spiced chicken, saffron, and fresh mint',
    price: 380,
    category: 'main-course',
    image: 'https://images.pexels.com/photos/6416470/pexels-photo-6416470.jpeg',
    isVeg: false,
    isAvailable: true,
    ingredients: ['basmati rice', 'chicken', 'saffron', 'yogurt', 'mint'],
    spiceLevel: 'spicy',
    preparationTime: 45
  },
  {
    id: '4',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in rich, creamy gravy with butter and cream',
    price: 220,
    category: 'main-course',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['black lentils', 'cream', 'butter', 'tomatoes', 'ginger'],
    spiceLevel: 'mild',
    preparationTime: 30
  },
  
  // Starters
  {
    id: '5',
    name: 'Chicken Tikka',
    description: 'Juicy chicken pieces marinated in yogurt and spices, grilled to perfection',
    price: 240,
    category: 'starters',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    isVeg: false,
    isAvailable: true,
    ingredients: ['chicken', 'yogurt', 'ginger-garlic paste', 'red chili powder'],
    spiceLevel: 'medium',
    preparationTime: 15
  },
  {
    id: '6',
    name: 'Samosa (2 pieces)',
    description: 'Crispy fried pastries stuffed with spiced potatoes and peas',
    price: 80,
    category: 'starters',
    image: 'https://images.pexels.com/photos/5560052/pexels-photo-5560052.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['potatoes', 'peas', 'cumin seeds', 'coriander', 'flour'],
    spiceLevel: 'mild',
    preparationTime: 10
  },

  // Breads
  {
    id: '7',
    name: 'Garlic Naan',
    description: 'Soft, fluffy bread topped with fresh garlic and herbs, baked in tandoor',
    price: 60,
    category: 'breads',
    image: 'https://images.pexels.com/photos/5560720/pexels-photo-5560720.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['flour', 'yogurt', 'garlic', 'butter', 'herbs'],
    spiceLevel: 'mild',
    preparationTime: 8
  },
  {
    id: '8',
    name: 'Chapati (2 pieces)',
    description: 'Traditional whole wheat flatbread, soft and freshly made',
    price: 30,
    category: 'breads',
    image: 'https://images.pexels.com/photos/5560720/pexels-photo-5560720.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['whole wheat flour', 'water', 'salt'],
    spiceLevel: 'mild',
    preparationTime: 5
  },

  // Desserts
  {
    id: '9',
    name: 'Gulab Jamun (4 pieces)',
    description: 'Soft, spongy milk dumplings soaked in sweet rose-flavored syrup',
    price: 120,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/6416673/pexels-photo-6416673.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['milk powder', 'flour', 'sugar', 'rose water', 'cardamom'],
    spiceLevel: 'mild',
    preparationTime: 12
  },

  // Beverages
  {
    id: '10',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk, cardamom, and ginger',
    price: 40,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['tea leaves', 'milk', 'cardamom', 'ginger', 'sugar'],
    spiceLevel: 'mild',
    preparationTime: 5
  },
  {
    id: '11',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with fresh mango and cardamom',
    price: 80,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg',
    isVeg: true,
    isAvailable: true,
    ingredients: ['yogurt', 'mango', 'sugar', 'cardamom', 'ice'],
    spiceLevel: 'mild',
    preparationTime: 3
  }
];

export const categories = [
  { id: 'all', name: 'All Items', icon: '🍽️' },
  { id: 'starters', name: 'Starters', icon: '🥗' },
  { id: 'main-course', name: 'Main Course', icon: '🍛' },
  { id: 'breads', name: 'Breads', icon: '🍞' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' }
];