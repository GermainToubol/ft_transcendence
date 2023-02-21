FROM alpine:3.17

RUN apk add --no-cache nginx openssl gettext
RUN adduser --system --no-create-home www-data
RUN mkdir -p /var/www/dist
RUN chown -R www-data:www-data /var/www/dist

COPY ./conf/nginx.conf /tmp/nginx.template
ENTRYPOINT ["sh", "-c", "envsubst < /tmp/ngix.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
