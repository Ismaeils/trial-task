# Version 1
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install \
    && npm run build \
    && rm -rf node_modules \
    && npm install --production
CMD ["npm", "run", "start"]