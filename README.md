## Project Setup Guide

This README provides complete instructions for installing dependencies, running, and building the project.

## Prerequisites

Ensure the following are installed on your system:

- **Node.js**: `v24.7.0`
- **npm**: `11.5.1`

You can verify your versions with:

```sh
node -v
npm -v
```

Follow these steps to setup the Project in your local and run:

```sh
# Step 1: Install the necessary dependencies.
npm i

# Step 2: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- Tailwind CSS

## Design Notes

### Assumptions
- Users have modern browsers with JavaScript enabled
- Product data will be provided via mock data initially
- Shopping cart state is maintained in browser session
- No user authentication required for basic functionality
- Mobile-first responsive design approach

### Trade-offs
- **State Management**: Used React Context instead of Redux for simplicity, trading scalability for development speed
- **Styling**: Chose Tailwind CSS over styled-components for faster development and smaller bundle size
- **Data Persistence**: Implemented localStorage for cart persistence instead of backend integration
- **UI Components**: Used shadcn/ui components for rapid prototyping over custom component development
- **Type Safety**: Full TypeScript implementation for better development experience vs. faster initial setup

### Future Improvements
- **Backend Integration**: Replace mock data with real API endpoints
- **User Authentication**: Add login/register functionality
- **Payment Processing**: Integrate with payment gateways (Stripe, PayPal)
- **Database**: Implement proper data persistence and user management
- **Performance**: Add lazy loading, code splitting, and image optimization
- **Testing**: Implement unit tests, integration tests, and E2E testing
- **PWA Features**: Add offline support and push notifications
- **Admin Panel**: Create dashboard for inventory and order management
- **Search & Filtering**: Implement advanced product search and filtering with backend integration
- **Reviews & Ratings**: Add customer review system

## Time Spent Log

**Total Development Time: 8 hours**

### Breakdown:
- **Project Setup & Configuration** (1 hour)
  - Vite + React + TypeScript setup
  - Tailwind CSS configuration
  - ESLint and development tools setup

- **UI Component Development** (2 hours)
  - shadcn/ui component integration
  - Custom component creation (ProductCard, Cart, Layout)
  - Responsive design implementation

- **State Management & Context** (1.5 hours)
  - React Context setup for global state
  - Cart functionality implementation
  - Type definitions and interfaces

- **Page Development** (2 hours)
  - Home page with product grid
  - Cart page with item management
  - Checkout modal implementation
  - Order management pages

- **Styling & Polish** (1 hour)
  - Tailwind CSS styling
  - Mobile responsiveness
  - UI/UX improvements

- **Bug Fixes** (0.5 hours)
  - Bug fixes and refinements