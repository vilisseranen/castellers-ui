FROM node:16 AS builder

# set workdir
WORKDIR /app

# copy dps
COPY package*.json ./
RUN npm install

# build
COPY . .
RUN npm run build 

# serve assets
FROM nginx:stable-alpine

RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

COPY deployment/fly.io/etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app

EXPOSE 80

CMD ["nginx"]