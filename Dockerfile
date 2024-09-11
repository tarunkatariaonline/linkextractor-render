FROM ghcr.io/puppeteer/puppeteer:23.3.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/snap/bin/chromium


WORKDIR /usr/src/app    
COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "index.js" ]