FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node package.json server.js ./
USER node
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
