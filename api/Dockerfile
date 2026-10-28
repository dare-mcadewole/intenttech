FROM node:20-alpine
WORKDIR /app
# build tools for native deps (bcrypt)
RUN apk add --no-cache python3 make g++
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY api/package.json ./api/
COPY web/package.json ./web/
COPY packages/contracts/package.json ./packages/contracts/
RUN npm install -g pnpm && pnpm install --filter @repo/api...
COPY . .
RUN pnpm --filter @repo/api build
EXPOSE 8080
CMD ["node", "api/dist/main.js"]
