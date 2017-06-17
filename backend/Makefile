check:
	pyflakes project
	pep8 project --max-line-length 100
	coverage run test && coverage report -m `find project/ | grep -v pyc | grep py`
