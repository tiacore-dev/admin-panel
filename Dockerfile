FROM node:20 AS builder

WORKDIR /app

ARG REACT_APP_AUTH_API_URL
ARG REACT_APP_REFERENCE_API_URL
ARG REACT_APP_ID

ENV REACT_APP_AUTH_API_URL=${REACT_APP_AUTH_API_URL}
ENV REACT_APP_REFERENCE_API_URL=${REACT_APP_REFERENCE_API_URL}
ENV REACT_APP_ID=${REACT_APP_ID}
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV CI=false
ENV GENERATE_SOURCEMAP=false

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


FROM node:20-slim

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/build ./build

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]
