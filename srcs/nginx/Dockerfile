FROM alpine:3.17

RUN apk add --no-cache nginx openssl gettext bind-tools
RUN adduser --system --no-create-home www-data
RUN mkdir -p /var/www/dist
RUN chown -R www-data:www-data /var/www/dist

COPY ./conf/nginx.conf /tmp/nginx.template
ENTRYPOINT ["sh", "-c", "FRONT=$(host frontend | head -1 | cut -d' ' -f 4) envsubst < /tmp/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
