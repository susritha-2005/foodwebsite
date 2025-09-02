# Online Food Ordering System with AI Chatbot

A comprehensive food ordering platform featuring an intelligent AI chatbot for personalized recommendations, built with React, TypeScript, and Supabase.

## Features

### Customer Features
- **Interactive Menu**: Browse authentic Indian dishes with detailed information
- **Smart Cart**: Add/remove items with quantity management
- **AI Chatbot**: Get personalized food recommendations and ingredient information
- **Real-time Tracking**: Track order status from preparation to delivery
- **User Profiles**: Manage personal information and order history
- **Secure Payments**: Integration ready for Razorpay/PayPal

### Admin Features
- **Order Management**: View and update order statuses in real-time
- **Menu Management**: Control item availability and pricing
- **Analytics Dashboard**: Track sales, popular items, and performance metrics
- **Customer Support**: Monitor chat interactions and feedback

### Technical Features
- **Real-time Updates**: Live order status changes
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Database Integration**: Supabase for scalable data management
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Beautiful design with smooth animations

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Step 1: Environment Configuration
Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-api-key
```

Replace the values with your actual Supabase project credentials from Settings → API in your Supabase dashboard.

### Step 2: Database Setup
1. Run the migration files in your Supabase SQL editor:
   - `supabase/migrations/create_initial_schema.sql`
   - `supabase/migrations/seed_menu_data.sql`

2. This will create all necessary tables and populate the menu with sample Indian dishes.

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

## Database Schema

### Tables
- **users**: Customer and admin accounts with authentication
- **menu_items**: Restaurant menu with categories, pricing, and availability
- **orders**: Order tracking with status updates and delivery information
- **chat_messages**: AI chatbot conversation history

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have elevated permissions for management
- Public read access for menu items

## AI Chatbot Features

The AI chatbot provides intelligent food recommendations and can:
- Suggest dishes based on dietary preferences (vegetarian, spice tolerance)
- Provide detailed ingredient information for allergies/preferences
- Explain spice levels and preparation times
- Recommend popular and chef's special items
- Answer questions about Indian cuisine and cooking methods

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## Project Structure

```
src/
├── components/          # React components
├── contexts/           # React context providers
├── data/              # Static data and configurations
├── hooks/             # Custom React hooks
├── lib/               # Third-party library configurations
├── services/          # Database and API services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions

supabase/
└── migrations/        # Database migration files
```

## Demo Accounts

The system includes demo login functionality:
- **Customer Account**: Browse menu, place orders, chat with AI
- **Admin Account**: Manage orders, view analytics, control inventory

## Deployment

The application is ready for deployment on platforms like:
- Vercel
- Netlify
- Bolt Hosting

Ensure environment variables are properly configured in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.