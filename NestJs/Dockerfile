FROM ubuntu:22.04

# Dependency require to rebuild tensorflow
# npm rebuild --build-from-source
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y \
    build-essential \
    curl \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    wget python3 make gcc libc6-dev 

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY share-1.0.1.tgz ./share-1.0.1.tgz


# Install app dependencies
RUN npm i --legacy-peer-deps

RUN npm rebuild @tensorflow/tfjs-node --build-from-source

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
