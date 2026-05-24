# 🛍️ ImageKit Online Store

A modern, production-ready e-commerce platform for digital image sales with professional authentication and payment processing. Built with Next.js 15, TypeScript, MongoDB, and industry best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🌐 Live Demo

**[🚀 View Live Demo](https://image-store-delta.vercel.app/)**

Experience the full functionality of the ImageKit Online Store with our live demo deployment.

## ✨ Key Features

### 🔐 Authentication & User Management
- **NextAuth.js Integration**: Secure credential-based authentication
- **Email Verification**: Complete verification system with email tokens
- **Role-Based Access**: User and admin roles with protected routes
- **Password Management**: Secure password hashing with bcrypt
- **Session Management**: JWT-based sessions with configurable expiry

### 🛒 E-commerce Functionality
- **Product Management**: Full CRUD operations for digital images
- **Multiple Image Variants**: Square, Wide, Portrait formats with different licenses
- **Razorpay Integration**: Secure payment processing with webhooks
- **Compliance & Legal**: Fully compliant with Razorpay merchant requirements including Terms, Privacy, and Refund policies
- **Order Management**: Complete order tracking and status updates
- **Download System**: High-quality image downloads for completed orders

### 🖼️ ImageKit Integration
- **Cloud Storage**: Seamless image upload and storage via ImageKit
- **Image Transformations**: Real-time image resizing and optimization
- **CDN Delivery**: Fast global image delivery
- **Quality Controls**: Multiple quality levels for previews and downloads

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first, accessible interface
- **Professional Components**: Consistent design patterns
- **Loading States**: Comprehensive loading components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database
- ImageKit account
- Razorpay account (for payments)
- Gmail account (for email services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/imagekit-online-store.git
   cd imagekit-online-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables (see [Environment Configuration](#environment-configuration))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Configuration

Configure these environment variables in your `.env.local`:

### Database
```env
MONGODB_URI=mongodb://localhost:27017/imagekit-store
```

### Authentication
```env
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### ImageKit (Get from ImageKit dashboard)
```env
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Client-side
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
NEXT_PUBLIC_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

### Payments (Razorpay)
```env
RAZORPAY_KEY_ID=your-key-id
# The server accepts RAZORPAY_SECRET_SECRET, RAZORPAY_KEY_SECRET, or RAZORPAY_SECRET for the API secret.
RAZORPAY_SECRET_SECRET=your-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-key-id
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

### Email (Gmail)
```env
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-password
```

## 🛠️ Admin Auto-Creation

On the first server start (or database connection), the application will check for an existing admin user.
- **If no admin exists:**
  - A new admin user will be created.
  - A secure random password will be generated.
  - Credentials will be emailed to `aryanak9163@gmail.com` using the configured Gmail credentials.
  - **Important:** Ensure `GMAIL_USER` and `GMAIL_PASSWORD` are correctly set up to receive this email.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (authentications)/ # Auth pages (login, register, verify)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── orders/            # Order management
│   ├── products/          # Product pages
│   └── components/        # Page-specific components
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   ├── providers/        # Context providers
│   └── ui/              # UI components (loading, preloader)
├── lib/                  # Utilities and configurations
├── models/              # MongoDB models
├── hooks/               # Custom React hooks
└── utils/               # Helper functions
```

## 🛠️ Usage & Documentation

### For Users
- **Browse Products**: View image gallery on homepage
- **Purchase Images**: Select variants and complete payment
- **Download Images**: Access high-quality downloads after purchase
- **Order History**: Track all your purchases

### For Admins
- **Product Management**: Add/edit products via `/admin`
- **Order Monitoring**: View all orders and their status
- **User Management**: Access user accounts and verification status

### For Developers
- **API Documentation**: RESTful API with comprehensive endpoints
- **Database Models**: Well-structured MongoDB schemas
- **Authentication Flow**: Complete auth implementation examples

## 🔧 API Reference

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user's orders

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify/[token]` - Email verification
- `POST /api/auth/request-verify` - Request new verification

## 🔒 Security Features

- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Comprehensive form validation
- **CSRF Protection**: NextAuth.js built-in protection
- **Secure Headers**: Production security headers
- **Environment Secrets**: Secure environment variable handling

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your environment
3. The app will automatically connect and create collections

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [ImageKit](https://imagekit.io) - Image management
- [Razorpay](https://razorpay.com) - Payment processing
- [MongoDB](https://mongodb.com) - Database
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide React](https://lucide.dev) - Icons

## 📞 Support

For questions, issues, or support:
- 📧 Open an issue on GitHub
- 📖 Check the API documentation
- 💬 Contact the development team

---

**⭐ If this project helped you, please give it a star!**

## 👨‍💻 Developer

**Developed by:** [Aryan Kumar](https://aryankumarofficial.tech)  
**Contact:** [aryanak9163@gmail.com](mailto:aryanak9163@gmail.com)  
**GitHub:** [@aryankumarofficial](https://github.com/aryankumarofficial)  
**LinkedIn:** [Aryan Kumar](https://linkedin.com/in/aryankumarofficial)
