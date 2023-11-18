FROM node:18-alpine 
WORKDIR /app
ENV SECRET_KEY fbedb4c084b35fcbc8e23f882b76eaad
ENV POSTGRES_DB postgres
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["node", "src/app.js"]
