FROM nginx

MAINTAINER Wuchaohua <wuchaohua@sunwoda.com>

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/default.conf /etc/nginx/conf.d/
COPY dist/  /usr/share/nginx/html/