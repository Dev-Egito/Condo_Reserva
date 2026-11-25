FROM node:22-bookworm

WORKDIR /app

COPY package.json package-lock.json ./
COPY shared/package.json ./shared/package.json
COPY api/package.json ./api/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci \
    && mkdir -p /app/frontend/node_modules \
    && chown -R node:node /app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=frontend", "--", "--host", "0.0.0.0", "--port", "5173"]
