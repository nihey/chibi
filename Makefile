deploy:
	cd frontend && npm run production
	rsync -azv . brinstar:/var/www/chibi --exclude frontend/node_modules \
		--exclude .git --exclude backend/venv --exclude backend/env \
		--exclude *.pyc --exclude backend/project/localconfig.py
