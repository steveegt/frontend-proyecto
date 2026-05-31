FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

# ✅ AQUÍ ESTÁ EL FIX REAL
COPY --from=build /app/dist/FrontEnd_Proyecto /usr/share/nginx/html

EXPOSE 80