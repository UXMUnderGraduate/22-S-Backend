FROM node:16
MAINTAINER Seonjae Hyeon <hsj106@mju.ac.kr>

RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN npm install

ENV NODE_ENV development

EXPOSE 5000

CMD ["npm", "start"]

