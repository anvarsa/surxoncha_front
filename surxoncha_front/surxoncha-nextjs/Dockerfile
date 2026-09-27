FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Railway may not expose runtime variables during image build.
ENV STRAPI_URL=https://surxonchafront-production-7610.up.railway.app
ENV NEXT_PUBLIC_STRAPI_URL=https://surxonchafront-production-7610.up.railway.app
ENV STRAPI_MEDIA_HOSTNAME=surxonchafront-production-7610.up.railway.app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
