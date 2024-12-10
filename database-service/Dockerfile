# Base image
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npx prisma generate

RUN npm install -g dotenv-cli

RUN npm run build

CMD ["npm", "run", "start:prod" ]
