FROM node:19-alpine
WORKDIR /carvalueapp
RUN npm install
COPY / .
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
