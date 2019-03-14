FROM python:2.7

WORKDIR /chibi

COPY . /chibi

RUN pip install -r backend/requirements.txt

ENV NODE_ENV = production

EXPOSE 80

WORKDIR /chibi/backend

CMD gunicorn server:app -b 0.0.0.0:80 -w 4 --error-logfile - --log-file -
