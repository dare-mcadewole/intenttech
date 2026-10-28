FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY web/package.json ./web/
COPY packages/contracts/package.json ./packages/contracts/
RUN npm install -g pnpm && pnpm install --filter @repo/web...
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "@repo/web", "dev"]
