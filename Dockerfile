FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
ARG BUILD_CONFIG=development
RUN npx ng build --configuration ${BUILD_CONFIG}

FROM nginx:alpine AS final
COPY --from=build /app/dist/vehicle-detection-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
