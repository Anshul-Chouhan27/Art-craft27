# ArtShop Fullstack v3 (bcrypt hashed admin password)

This version adds a secure admin login using bcrypt-hashed password stored in env, JWT tokens, and admin login popup triggered from the header 'Admin' button.

Steps to run:
1. Generate bcrypt hash for your admin password:
   node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"
2. Copy the hash into server/.env (ADMIN_PASSWORD_HASH) and set JWT_SECRET.
3. Start server and client:
   cd server && npm install && npm run dev
   cd ../client && npm install && npm run dev
