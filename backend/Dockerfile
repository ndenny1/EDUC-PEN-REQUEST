FROM node:lts-alpine

WORKDIR /opt/app-root/src

COPY package*.json ./
RUN npm ci

RUN npm run build
EXPOSE 443 8080
CMD ["npm", "start"]