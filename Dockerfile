FROM node:18.20.4
WORKDIR /app
RUN npm install -g npm@10.8.2
RUN npm install -g inxi
COPY . .
RUN npm install
EXPOSE 21900
CMD ["npm", "run", "dev3"]

