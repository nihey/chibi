import base64

from flask import Flask, render_template, Response, request
from flask_restful import Api
from flask_pymongo import PyMongo
from werkzeug.utils import ImportStringError

app = Flask(__name__, template_folder="../../frontend/dist")

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

#
# Base Routes
#

@app.route('/image/<id_>.png')
def image(id_):
    from project.collections.sprite import Sprite
    sprite = Sprite.find_one({'id': id_})
    if not sprite:
        return Response('', code=404)
    data_url = sprite['image']
    image = base64.decodestring(data_url.split('base64,')[1])
    return Response(image, mimetype='application/base64')

@app.route('/')
@app.route('/index.html')
def index():
    return render_template(
        'index.html',
        title="Chibi Creator",
        description="Create and share your chibi sprites here!",
        image="https://raw.githubusercontent.com/nihey/chibi/master/meta.png",
        path=request.path,
    )


@app.route('/gallery/new')
@app.route('/gallery/new/index.html')
@app.route('/gallery/top')
@app.route('/gallery/top/index.html')
def gallery():
    return render_template(
        'index.html',
        title="Chibi Gallery",
        description="Check out a collection of chibi sprites here!",
        image="https://raw.githubusercontent.com/nihey/chibi/master/meta.png",
        path=request.path,
    )


@app.route('/p/<id_>')
@app.route('/p/<id_>/index.html')
def sprite(id_):
    from project.collections.sprite import Sprite
    attrs = dict(
        title="Chibi Gallery",
        description="Check out a collection of chibi sprites here!",
        image="https://raw.githubusercontent.com/nihey/chibi/master/meta.png",
        path=request.path,
    )
    sprite = Sprite.find_one({'id': id_})
    if sprite:
        attrs['title'] = sprite.get('name')
        attrs['description'] = 'Chibi Center - ' + sprite.get('name', '')
        attrs['image'] = 'https://chibi.center/image/' + id_ + '.png'

    return render_template(
        'index.html',
        **attrs
    )
