# Stage 1: Build the TypeScript project
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Compile TypeScript to JavaScript (ensure you have a "build" script in package.json)
RUN pnpm build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy only the compiled output and necessary package files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Run the app (change the entry point if necessary)
CMD ["pnpm", "start"]
