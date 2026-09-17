FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .

ARG SUPERADMIN_USERNAME
ARG SUPERADMIN_PASSWORD
ARG COOKIE_SECRET
ARG BUILD_CMD="npm run build"

RUN ${BUILD_CMD} && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
