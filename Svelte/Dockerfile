FROM node:18 as base

WORKDIR /app
COPY package*.json ./
COPY share-1.0.1.tgz ./share-1.0.1.tgz
RUN npm ci
COPY . .

RUN npm run build

FROM nginx:latest
COPY --from=base /app/dist /usr/share/nginx/html