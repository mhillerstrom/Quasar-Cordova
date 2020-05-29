# First we build necessary modules in builder-image
FROM node:11-alpine as builder

RUN apk add --no-cache --virtual .build-deps \
		bash \
		git \
    binutils-gold \
    curl \
    g++ \
    gcc \
    gnupg \
    libgcc \
    linux-headers \
    make \
    glib \
    python \
    pkgconfig \
    autoconf \
    automake \
    libtool \
    nasm \
    build-base \
    zlib-dev

RUN apk --no-cache add ca-certificates wget
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-2.31-r0.apk
RUN apk add glibc-2.31-r0.apk
RUN rm glibc-2.31-r0.apk


WORKDIR /var/www

ENV NODE_ENV=development
COPY ./package.json .
RUN npm  install --target_libc=glibc --target_arch=x64 --target_platform=linux


# Now we create the final app-image with help from builder-image
FROM node:11-alpine as app

# add system user 'myapp' to run under (we match with primary developer uid `id -u` and gid `id -gn`)
# RUN addgroup -f -g 20 staff
RUN adduser --disabled-password -u 501 myapp -g users

RUN mkdir -p /home/myapp
RUN chown -R myapp:users /home/myapp
RUN mkdir -p /var/www/node_modules
RUN chown -R myapp:users /var/www
USER myapp

# Copy installed NodeJS modules from builder-image
COPY --from=builder --chown=myapp:users /var/www/ /var/www/

WORKDIR /var/www

# Copy application files from development dir
COPY --chown=myapp:users ./package.json .
COPY --chown=myapp:users ./config ./config
COPY --chown=myapp:users ./server ./server
COPY --chown=myapp:users ./src ./src
COPY --chown=myapp:users ./www ./www
#COPY --chown=myapp:users ./webpack ./webpack
#COPY --chown=myapp:users ./webpack.config.js .
#COPY --chown=myapp:users ./gulpfile.js .
COPY --chown=myapp:users ./environment* .


# Port 9222 is nodejs debug port
EXPOSE 8081 9222

# Share these directories with the host
VOLUME /var/www/server /var/www/src /var/www/config /var/www/www

CMD ["npm", "run", "mydev"]

# COPY ../dontdie.js /var/www/
# CMD ["node", "dontdie.js"]
