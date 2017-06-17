from project.app import app, api
from project.utils import get_subclasses
from project.api.base import BaseResource
from project.api.decorators import rest_resource


# Register all REST endpoints
for cls in get_subclasses('project', BaseResource):
    if cls.route is not None:
        api.add_resource(rest_resource(cls), cls.route)

if __name__ == "__main__":
    app.run("0.0.0.0")
