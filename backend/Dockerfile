# Use the official Node.js image as the base
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json for dependency installation
COPY package*.json  .

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Copy the wait-for-it script for dependency readiness checks
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Expose the application port
EXPOSE 4000

# Set the entrypoint to run the script
ENTRYPOINT ["./entrypoint.sh"]
