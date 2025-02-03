FROM node:12 AS builder

# set workdir
WORKDIR /app

# copy dps
COPY package*.json ./
RUN npm install

# build
COPY . .
RUN npm run build 

# serve assets
FROM httpd:2.4

COPY --from=builder /app/dist /usr/local/apache2/htdocs/
