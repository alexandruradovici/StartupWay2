FROM node:14 as build

# Primul container
WORKDIR /startupway

COPY . .

RUN npm install
RUN npm run clean
RUN npm run bootstrap
RUN npm run build
RUN npx lerna clean -y
RUN rm -rf node_modules

FROM node:14

#Al doilea container
WORKDIR /startupway

RUN apt-get update && apt-get install ffmpeg --no-install-recommends -y

COPY --from=build /startupway /startupway

RUN npx lerna bootstrap --hoist -- --production --no-optional

EXPOSE 8080

CMD cd distributions/startupway && npm run start