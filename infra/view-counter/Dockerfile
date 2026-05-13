FROM node:22-alpine

WORKDIR /app

COPY server.mjs .

ENV NODE_ENV=production
ENV VIEW_COUNTER_HOST=0.0.0.0
ENV VIEW_COUNTER_PORT=3000
ENV VIEW_COUNTER_DATA_FILE=/data/views.json

EXPOSE 3000

CMD ["node", "server.mjs"]
