import json
from decimal import Decimal
from functools import wraps

from flask import Response


def json_default(value):
    if isinstance(value, Decimal):
        return float(value)
    return unicode(value)


def rest(domain):
    def inner(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            response = func(*args, **kwargs)
            # Make sure the response is an 'Response' object
            if not isinstance(response, Response):
                response = json.dumps(response, default=json_default)
                response = Response(response, mimetype='application/json')

            # Then add the CORS headers
            response.headers['Access-Control-Allow-Origin'] = domain
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
            response.headers['Access-Control-Allow-Methods'] = 'POST, PATCH, GET, DELETE, PUT'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response
        return decorated
    return inner


def rest_resource(cls):
    def pop_blacklist(dict_or_list_or_attr, blacklist=['password']):
        if isinstance(dict_or_list_or_attr, dict):
            for attr in blacklist:
                dict_or_list_or_attr.pop(attr, None)
            for key, value in dict_or_list_or_attr.iteritems():
                dict_or_list_or_attr[key] = pop_blacklist(value, blacklist)
            return dict_or_list_or_attr
        if isinstance(dict_or_list_or_attr, list):
            return [pop_blacklist(a, blacklist) for a in dict_or_list_or_attr]
        return dict_or_list_or_attr

    def rest(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            response = func(*args, **kwargs)
            # Make sure the response is an 'Response' object
            if not isinstance(response, Response):
                response = pop_blacklist(response)
                response = json.dumps(response, default=json_default)
                response = Response(response, mimetype='application/json')

            # Then add the CORS headers
            response.headers['Access-Control-Allow-Origin'] = cls.domain
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
            response.headers['Access-Control-Allow-Methods'] = 'POST, PATCH, GET, DELETE, PUT'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response
        return decorated

    # Decorate get, put, post, delete and patch methods from the class
    for method in ['get', 'put', 'post', 'delete', 'patch', 'options']:
        if hasattr(cls, method):
            setattr(cls, method, rest(getattr(cls, method)))
    return cls
