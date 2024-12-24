FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install required dependencies
RUN apt update && apt install -y openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]