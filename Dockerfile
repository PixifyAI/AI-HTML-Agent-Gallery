# Install dependencies and build the app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Choose one of the following based on your lock file
# RUN npm install
# RUN yarn install
RUN pnpm install

COPY . .

RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NODE_ENV production

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npx", "next", "start"]
