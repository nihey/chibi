import unittest
import json

from project.app import app
from project.collections.base import BaseCollection
from project.utils import get_or_set_fixture, get_subclasses


def database_test(func):
    def decorated_method(self, *args, **kwargs):
        with app.app_context():
            for collection in get_subclasses('project', BaseCollection):
                collection.remove({})
        func(self, *args, **kwargs)
    return decorated_method


class BaseTestCase(unittest.TestCase):
    def assert_not_called(self, mocked):
        return mocked.assert_not_called()

    def assert_called_once(self, mocked):
        return mocked.assert_called_once()

    def assertRequest(self, name, method, route, params=None, data=None,
                      nocover=None):
        nocover = nocover or []
        params = params or {}
        route += '?' + '&'.join('{}={}'.format(k, v) for k, v in params.iteritems())

        name += '-request.json'
        method = method.lower()

        received = getattr(self.app, method)(
            route,
            data=data,
        ).data
        received = json.loads(received)
        for attr in nocover:
            received.pop(attr, None)

        expected = get_or_set_fixture(name, received)
        self.assertEqual(received, expected)

    def setUp(self):
        # Create Flask App
        self.app = app.test_client()

        # Apply patches if needed
        with app.app_context():
            if not app.config['MONGO_DBNAME'].endswith('test'):
                app.config['MONGO_DBNAME'] = app.config['MONGO_DBNAME'] + '_test'
                for collection in get_subclasses('project', BaseCollection):
                    collection.generate_indexes()

        # TestCase option
        self.maxDiff = None
