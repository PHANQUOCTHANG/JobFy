FROM node:20-alpine

WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server and bind to all interfaces (required for Docker networking)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
