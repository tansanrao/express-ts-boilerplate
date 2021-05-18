FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# Install node-modules
RUN yarn install --frozen-lockfile

COPY dist/ ./

EXPOSE 3000

CMD ["node", "server.js"]
