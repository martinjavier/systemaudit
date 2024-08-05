FROM node:18.17.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 1234

CMD [ "npm", "npm run dev3"]
