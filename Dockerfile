# A Fedora 25 BDCS API Container
FROM welder/web-nodejs:latest
MAINTAINER Brian C. Lane <bcl@redhat.com>
RUN dnf install -y nginx

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD nginx -g "daemon off;"
EXPOSE 3000

## Do the things more likely to change below here. ##

COPY ./docker/nginx.conf /etc/nginx/

# Update node dependencies only if they have changed
COPY ./package.json /welder/package.json
RUN cd /welder/ && npm install

# Copy the rest of the UI files over and compile them
COPY . /welder/
RUN cd /welder/ && node run build
