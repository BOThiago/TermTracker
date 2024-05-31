FROM node:20-alpine

WORKDIR /term-tracker-application

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
