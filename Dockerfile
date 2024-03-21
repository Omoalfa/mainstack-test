# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY ./src /usr/src/app/src
COPY ./prisma /usr/src/app/prisma

# Expose the port on which your app runs
EXPOSE 4004

# Define the command to run your app
CMD ["npm", "start"]
