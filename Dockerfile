FROM welder/web-nodejs:latest
LABEL maintainer="Brian C. Lane" \
      email="bcl@redhat.com" \
      baseimage="Fedora:latest" \
      description="A welder-web container running on Fedora"
RUN dnf install -y nginx

CMD nginx -g "daemon off;"
EXPOSE 3000

## Do the things more likely to change below here. ##

COPY ./docker/nginx.conf /etc/nginx/

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Update node dependencies only if they have changed
COPY ./package.json /welder/package.json
RUN cd /welder/ && npm install

# Copy the rest of the UI files over and compile them
COPY . /welder/
RUN cd /welder/ && node run build
