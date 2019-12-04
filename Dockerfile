FROM quay.io/ukhomeofficedigital/node-8:latest

ENV PTTG_API_ENDPOINT localhost
ENV USER_ID 1000
ENV GROUP pttg
ENV NAME pttg-ip-fm-ui

ARG VERSION

WORKDIR /app

RUN mkdir -p /app && \
    chown -R node /app

COPY . /app
RUN npm --loglevel warn install --only=prod
RUN npm --loglevel warn run postinstall

RUN chmod a+x /app/run.sh

USER ${USER_ID}

EXPOSE 8000

ENTRYPOINT /app/run.sh
