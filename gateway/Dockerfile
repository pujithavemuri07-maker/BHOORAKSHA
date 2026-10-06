FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.dev.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/log/nginx /etc/nginx/ssl

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
