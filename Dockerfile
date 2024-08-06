FROM node:18.20.4
WORKDIR /app
RUN npm install -g npm@10.8.2
RUN wget -O inxi https://github.com/smxi/inxi/raw/master/inxi \
    && chmod +x inxi \
    && mv inxi /usr/local/bin/
RUN apt install pciutils
COPY . .
RUN npm install
EXPOSE 21900
CMD ["npm", "run", "dev3"]