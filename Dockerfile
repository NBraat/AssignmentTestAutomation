# Use Nginx as the base image
FROM nginx:alpine

# Copy the application files to the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
