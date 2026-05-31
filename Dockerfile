FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

# 🔥 ESTA LÍNEA ES LA BUENA
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80
