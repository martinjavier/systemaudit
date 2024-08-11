FROM node:18.20.4
WORKDIR /app
RUN npm install -g npm@10.8.2
RUN apt-get update
RUN apt-get -y install dmidecode
RUN wget -O inxi https://github.com/smxi/inxi/raw/master/inxi \
    && chmod +x inxi \
    && mv inxi /usr/local/bin/
COPY . .
RUN npm install
EXPOSE 21900
CMD ["npm", "run", "prod"]