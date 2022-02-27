FROM node:lts-alpine
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV CLIENT_ID=${CLIENT_ID}
ENV GUILD_ID=${GUILD_ID}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm","run","dev" ]
