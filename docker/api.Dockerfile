FROM node:22-bookworm

WORKDIR /app

COPY package.json package-lock.json ./
COPY shared/package.json ./shared/package.json
COPY api/package.json ./api/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci && chown -R node:node /app

COPY docker/api-entrypoint.sh /usr/local/bin/dev-entrypoint.sh
RUN chmod +x /usr/local/bin/dev-entrypoint.sh

USER node

EXPOSE 3001

ENTRYPOINT ["dev-entrypoint.sh"]
