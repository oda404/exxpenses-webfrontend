
FROM node:19.9.0

WORKDIR /usr/src/exxpenses-website

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn next telemetry disable
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]

