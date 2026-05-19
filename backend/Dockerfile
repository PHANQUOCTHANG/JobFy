FROM node:20-alpine

# Install openssl required by Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Copy prisma schema BEFORE npm install
# because the postinstall script runs "prisma generate" which needs schema.prisma
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install all dependencies (this will also run "prisma generate" via postinstall)
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start in development mode
CMD ["npm", "run", "dev"]
