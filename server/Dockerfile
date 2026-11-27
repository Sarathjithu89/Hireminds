
#----------------Stage 1: Build---------------
FROM node:26-alpine AS builder

WORKDIR /app

#copy ONLY package files 
COPY package*.json ./
RUN npm ci

#copy source code and compile 
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

#--------------Stage 2: Production Runner------------
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

#install dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

#Copy complied JS form stage 1
COPY --from=builder /app/dist ./dist

#run node as user
USER node

EXPOSE 5000

CMD [ "node","dist/server.js" ]
