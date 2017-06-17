import os
from datetime import datetime

from project.collections.base import BaseCollection
from project.api.base import required
from project.utils import json_response


class Sprite(BaseCollection):
    __collection_keys__ = [
        {'id'},
    ]

    #
    # API Endpoints
    #

    @classmethod
    def get(cls, endpoint):
        id_ = cls.get_arg('id')
        if id_:
            sprite = cls.find_one({'id': id_})
            if not sprite:
                return json_response({'error': 'not found'}, code=404)
            return sprite
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    @required('name', 'gender', 'setting', 'image')
    def post(cls, endpoint):
        id_ = os.urandom(16).encode('hex')
        sprite = cls.get_or_create(
            id=id_,
            gender=cls.get_arg('gender'),
            name=cls.get_arg('name'),
            setting=cls.get_arg('setting'),
            image=cls.get_arg('image'),
            created_on=datetime.now(),
        )
        sprite.pop('_id', None)
        return sprite

    @classmethod
    def patch(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    def delete(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)
