import os
import json
from datetime import datetime
from inspect import isclass

from flask import Response, session
from bson.objectid import ObjectId


def log(*args):
    string = ' '.join([unicode(a).encode('utf-8') for a in args])
    print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '-', string)


def json_response(dict_, code=200):
    return Response(json.dumps(dict_), code, mimetype='application/json')


def unset_user():
    session.pop('user_id', None)


def set_user(user):
    session['user_id'] = unicode(user['_id'])
    return user


def get_user():
    from project.collections.user import User
    return User.find_one({'_id': ObjectId(session.get('user_id'))})


def get_subclasses(directory, cls):
    """Get all the classes within a directory"""
    # TODO: Implement a multilevel search
    modules = [m.replace('.py', '') for m in os.listdir(directory)
               if m.endswith('py')]

    subclasses = []
    base = directory.replace('/', '.')
    for module in modules:
        # Import the module and walk the steps untill the leaf one
        path = (base + '.' + module).replace('.__init__', '')
        module = __import__(path)
        for step in path.split('.')[1:]:
            module = getattr(module, step)

        for variable in module.__dict__.itervalues():
            if isclass(variable) and issubclass(variable, cls):
                subclasses.append(variable)

    for subdir in os.listdir(directory):
        # Avoid infinite loops by removing __init__.py
        if subdir.startswith('__init__'):
            continue

        subdir = os.path.join(directory, subdir)
        if os.path.isdir(subdir):
            subclasses += get_subclasses(subdir, cls)

    return subclasses


def get_fixture(name):
    directory = os.path.dirname(os.path.dirname(__file__))
    path = os.path.join(directory, 'assets', 'fixtures', name)

    if not os.path.exists(path):
        return None

    with open(path) as file_:
        content = file_.read()
        if name.endswith('.json'):
            return json.loads(content)
        return content


def set_fixture(name, content):
    if name.endswith('.json'):
        content_text = json.dumps(content, sort_keys=True, indent=2)
    else:
        content_text = content

    directory = os.path.dirname(os.path.dirname(__file__))
    path = os.path.join(directory, 'assets', 'fixtures', name)
    with open(path, 'w') as file_:
        file_.write(content_text)
    return content


def get_or_set_fixture(name, content):
    return get_fixture(name) or set_fixture(name, content)
