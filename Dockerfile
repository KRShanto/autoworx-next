FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]