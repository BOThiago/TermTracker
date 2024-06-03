FROM node:20-alpine

WORKDIR /term-tracker-application

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN apk add --no-cache iputils busybox-extras

EXPOSE $PORT

CMD ["node", "dist/main"]
