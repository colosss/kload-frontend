# ================= BUILD STAGE =================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# SPA-конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем билд
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
