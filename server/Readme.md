📁 server/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── 📁 src/
    ├── index.js                  ✅ entry point
    ├── 📁 config/
    │   └── db.js                 ✅ MongoDB connection
    ├── 📁 controllers/
    │   └── auth.js               ✅ register/login logic
    ├── 📁 middlewares/
    │   └── auth.js               ✅ JWT verify middleware
    ├── 📁 models/
    │   └── User.js               ✅ User schema
    ├── 📁 routes/
        └── authRoutes.js         ✅ Auth routes
