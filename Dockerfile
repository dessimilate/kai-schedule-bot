FROM node:18.19.1-alpine3.19
WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 4201

CMD [ "yarn", "dev" ]