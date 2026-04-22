FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 🔥 ADD THIS LINE
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]