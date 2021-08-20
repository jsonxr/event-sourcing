FROM node:15.2.1-buster
RUN apt-get update && apt-get upgrade -y
RUN wget -O apache-pulsar-client.deb 'https://www.apache.org/dyn/mirrors/mirrors.cgi?action=download&filename=pulsar/pulsar-2.7.0/DEB/apache-pulsar-client.deb'
# RUN wget https://www.apache.org/dyn/mirrors/mirrors.cgi?action=download&filename=pulsar/pulsar-2.7.1/DEB/apache-pulsar-client-dev.deb
# RUN apt-get install ./apache-pulsar-client*.deb
# USER node
# WORKDIR /home/node
# COPY --chown=node ./package*.json .
# RUN npm install
# COPY ./src ./src
# RUN node_modules/.bin/tsc src/index.ts
# CMD ["node","src/index.js","--event","Generic_Change_Event__e","--replay","-2"]
