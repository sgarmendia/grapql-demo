# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json for dependency installation
COPY package.json  ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Copy the wait-for-it script for dependency readiness checks
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Copy the entrypoint script
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Expose the application port
EXPOSE 4000

# Set the entrypoint to run the script
ENTRYPOINT ["./entrypoint.sh"]
