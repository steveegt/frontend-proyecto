FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

# ✅ copiar TODO lo que haya en dist
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80