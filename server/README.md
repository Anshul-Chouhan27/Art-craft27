# ArtShop Server v3 (Express + Mongoose + JWT + Multer + bcrypt)

**Env (.env):**
```
MONGODB_URI=mongodb://localhost:27017/artshop
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
ADMIN_PASSWORD_HASH=$2b$10$REPLACE_WITH_YOUR_HASH
JWT_SECRET=replace_with_a_strong_random_secret
```

Generate password hash (example):
```bash
node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"
```

Start server:
```bash
cd server
npm install
npm run dev
```
