DATE = $(shell date +'%Y-%m-%dT%H:%M:%S')

backup:
	ssh brinstar "cd /tmp && mongodump -d chibi -o /tmp/ && tar -cvzf chibi.tar.gz ./chibi/"
	scp brinstar:/tmp/chibi.tar.gz ~/backups/chibi/chibi-$(DATE).tar.gz

reload:
	docker-compose build chibi
	docker-compose up --no-deps -d chibi

deploy:
	cd frontend && npm run production
	rsync -azv . brinstar:/var/www/chibi --exclude frontend/node_modules \
		--exclude .git --exclude backend/venv --exclude backend/env \
		--exclude *.pyc --exclude backend/project/localconfig.py
