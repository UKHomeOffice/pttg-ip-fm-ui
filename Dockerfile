FROM quay.io/ukhomeofficedigital/nodejs-base:v6.11.0-0

ENV PTTG_API_ENDPOINT localhost
ENV USER user-pttg-ip-ui
ENV GROUP group-pttg-ip-ui
ENV NAME pttg-ip-fm-ui

ARG VERSION

WORKDIR /app

RUN groupadd -r ${GROUP} && \
    useradd -r -g ${GROUP} ${USER} -d /app && \
    mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

COPY . /app
RUN npm --loglevel warn install --only=prod
RUN npm --loglevel warn run postinstall

RUN chmod a+x /app/run.sh

USER ${USER}

EXPOSE 8000

ENTRYPOINT /app/run.sh
