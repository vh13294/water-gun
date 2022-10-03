FROM node:18 as base

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY ../Share ../Share

RUN npm run build

FROM nginx:latest
COPY --from=base /app/dist /usr/share/nginx/html