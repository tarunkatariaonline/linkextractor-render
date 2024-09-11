# Base image
FROM node:16

# Install necessary dependencies for Puppeteer
RUN apt-get update && \
    apt-get install -yq libgconf-2-4 \
    libxss1 \
    libnss3 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    libgbm-dev \
    && apt-get clean

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port
EXPOSE 3000

# Command to start the app
CMD ["node", "index.js"]
