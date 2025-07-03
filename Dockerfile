 # Stage 1: Build the React app
FROM node:19 as build

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
