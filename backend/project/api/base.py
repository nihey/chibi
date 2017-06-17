import json

from flask import request
from flask_restful import Resource
from cached_property import cached_property

from project.app import app
from project.collections.base import BaseCollection
from project.utils import get_subclasses, json_response


class BaseResource(Resource):
    """Provides some extra perks into Flask Restful's Resources"""

    # The domain to be allowed on CORS
    domain = app.config['DOMAIN']

    #: The route on which the Resource will be
    #:
    #: Examples:
    #:
    #: route = '/video/<code>'
    #: route = '/video'
    route = None

    def get_arg(self, attr, default=None):
        """Return the argument, wheter it came from querystring or form data"""
        return request.form.get(attr, request.args.get(attr, default))

    def options(self, *args, **kwargs):
        """Just in case a Browser wants to do a CORS check"""
        return {'message': 'OK'}


def required(*required_args):
    def decorator(func):
        def decorated_function(self, *args, **kwargs):
            missing = [a for a in required_args if self.get_arg(a) is None]
            if len(missing) > 0:
                return json_response({'missing': missing}, code=400)
            return func(self, *args, **kwargs)
        return decorated_function
    return decorator


def general_resource_endpoint(func):
    def decorated_function(self, resource, *args, **kwargs):
        if resource not in self.resources.keys():
            return json_response({'error': 'resource not found'}, code=404)

        resource = self.resources[resource]
        if hasattr(resource, func.__name__):
            return getattr(resource, func.__name__)(self, *args, **kwargs)
        return func(self, resource, *args, **kwargs)
    return decorated_function


class GeneralResource(BaseResource):
    """General Resources CRUD operations"""
    route = '/<resource>'

    # Maximum number of instances returned in a single request
    limit = 30

    @cached_property
    def resources(self):
        return {r.__collection__: r for r in get_subclasses('project', BaseCollection)
                if r.__valid__}

    @general_resource_endpoint
    def get(self, resource):
        """Generic endpoint to retrieve collection data (READ)"""
        # Query
        q = json.loads(request.args.get('q', 'null'))
        # Projection
        p = json.loads(request.args.get('p', 'null'))

        # Return value
        return list(resource.find(q, p).limit(self.limit))

    @general_resource_endpoint
    def post(self, resource):
        """Generic endpoint to add collection data (CREATE)"""
        return resource.get_or_create(**request.json)

    @general_resource_endpoint
    def patch(self, resource):
        """Generic endpoint to update collection data (UPDATE)"""
        return resource.update(request.json['q'], request.json['u'])

    @general_resource_endpoint
    def delete(self, resource):
        """Generic endpoint to delete collection data (DELETE)"""
        return resource.update(request.json['q'], request.json['p'])
