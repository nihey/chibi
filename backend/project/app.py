from flask import Flask
from flask_restful import Api
from flask_pymongo import PyMongo
from werkzeug.utils import ImportStringError

app = Flask(__name__)

app.config.from_object('project.config.Config')
try:
    app.config.from_object('project.localconfig.Config')
except ImportStringError:
    pass

#
# Our custom Flask CLI commands
#


@app.cli.command()
def generate_indexes():
    """Create MongoDB indexes set on our collections"""
    from project.utils import get_subclasses, log
    from project.collections.base import BaseCollection
    for klass in get_subclasses('project', BaseCollection):
        if klass.__collection__ is not None:
            log('generating index', klass.generate_indexes())

#
# Other Flask Addons
#

api = Api(app, prefix='/api')
mongo = PyMongo(app)
