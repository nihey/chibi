import re

import pymongo
from flask import request

from project.app import mongo


class BaseCollection(object):

    ASCENDING = pymongo.ASCENDING
    DESCENDING = pymongo.DESCENDING

    #: Sets __collection__ property in a dynamic way
    class __metaclass__(type):
        #: The name of the collection (like the name of the table)
        @property
        def __collection__(cls):
            def func(x):
                return '-' + x.group(0).lower()
            return re.sub(r'[A-Z]', func, cls.__name__)[1:]

        # Can this collection be used for common operations?
        @property
        def __valid__(cls):
            return len(cls.__collection_keys__) > 0

    #: An array of sets, each set defining a unique key of the collection.
    #: The first set of keys is considered to be the primary key
    #:
    #: Example: __collection_keys__ = [{'email'}, {'username'}]
    __collection_keys__ = []

    #
    # DDL-Like Methods
    #

    @classmethod
    def generate_indexes(cls):
        for keys in cls.__collection_keys__:
            uniques = [(k, pymongo.DESCENDING) for k in keys]
            cls.create_index(uniques, unique=True)

    #
    # MongoDB Methods
    #

    @classmethod
    def create_index(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].create_index(*args, **kwargs)

    @classmethod
    def insert(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].insert(*args, **kwargs)

    @classmethod
    def insert_many(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].insert_many(*args, **kwargs)

    @classmethod
    def find(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].find(*args, **kwargs)

    @classmethod
    def find_one(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].find_one(*args, **kwargs)

    @classmethod
    def update(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].update(*args, **kwargs)

    @classmethod
    def remove(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].remove(*args, **kwargs)

    @classmethod
    def group(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].group(*args, **kwargs)

    @classmethod
    def aggregate(cls, *args, **kwargs):
        return mongo.db[cls.__collection__].aggregate(*args, **kwargs)

    @classmethod
    def get_or_create(cls, **attrs):
        # Will cause a KeyError if a key is missing
        keys = {key: attrs[key] for key in cls.__collection_keys__[0]}

        # Check if none of the keys is None
        if not all(keys.itervalues()):
            key_names = ' and '.join(keys.iterkeys())
            raise ValueError('{} must not be Falsy'.format(key_names))

        found = cls.find_one(keys)
        if not found:
            cls.insert(attrs)
            return cls.find_one(keys)
        cls.update(keys, {
            '$set': attrs,
        })
        return cls.find_one(keys)

    #
    # API
    #

    @classmethod
    def get_arg(cls, attr, default=None):
        """Return the argument, wheter it came from querystring or form data"""
        request_json = request.get_json()
        if request_json:
            return request_json.get(attr, default)
        return request.form.get(attr, request.args.get(attr, default))
