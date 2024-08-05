FROM node:18.17.0
WORKDIR /app
RUN npm install -g npm@10.8.2
COPY . .
RUN npm install
EXPOSE 21900
CMD ["npm", "run", "dev3"]

