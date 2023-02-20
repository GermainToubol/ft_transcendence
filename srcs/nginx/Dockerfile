FROM alpine:3.17

RUN apk add --no-cache nginx openssl
RUN adduser --system --no-create-home www-data
RUN mkdir -p /var/www/dist
RUN chown -R www-data:www-data /var/www/dist

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
