import os
from hashlib import sha512

from project.collections.base import BaseCollection
from project.utils import json_response


class User(BaseCollection):
    __collection_keys__ = [
        {'email'},
    ]

    @classmethod
    def hash(cls, text):
        return sha512(text).hexdigest()

    @classmethod
    def hash_password(cls, password):
        # Password with random generated salt
        salt = os.urandom(10).encode('hex')
        return salt + '|' + cls.hash(salt + password)

    @classmethod
    def compare_password(cls, user, password):
        salt, hash_ = user['password'].split('|')
        return cls.hash(salt + password) == hash_

    @classmethod
    def authenticate(cls, email, password):
        user = cls.find_one({'email': email})
        if not user or not cls.compare_password(user, password):
            return False
        return user

    @classmethod
    def get_or_create(cls, **attrs):
        if attrs.get('password') is not None:
            attrs['password'] = cls.hash_password(attrs['password'])
        return super(User, cls).get_or_create(**attrs)

    #
    # API Endpoints
    #

    @classmethod
    def get(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    def post(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    def patch(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    def delete(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)
