# Crypto_discord_bot
Check price and set alert price

### Recommended
Install docker

### Customize configuration
User need to create environment(.env) and config file
```sh
DISCORD_TOKEN=xxx
CLIENT_ID=xxx
GUILD_ID=xxx
```

or Dockerfile
```sh
ENV DISCORD_TOKEN=xxx
ENV CLIENT_ID=xxx
ENV GUILD_ID=xxx
```


### Project Setup
```sh
npm install
```

### Development
```sh
npm run dev
```

### build (docker)
```sh
docker build -t crypto_discord_bot .
```

### docker run on container
```sh
docker run crypto_discord_bot:latest
```

### save tar.gz
```sh
docker save crypto_discord_bot:latest | gzip > crypto_discord_bot_latest.tar.gz
```

