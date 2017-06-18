import os
from datetime import datetime

from bson.code import Code

from project.collections.base import BaseCollection
from project.api.base import required
from project.utils import json_response, get_ip


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
            sprite['vote'] = SpriteVote.get_vote(sprite['id'])
            sprite['votes'] = SpriteVote.get_sprite_votes(sprite['id'])
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


class SpriteVote(BaseCollection):
    __collection_keys__ = [
        {'ip'},
    ]

    @classmethod
    def get_vote(cls, id_, ip=None):
        if not ip:
            ip = get_ip()
        return cls.get_or_create(ip=ip).get(id_, 0)

    @classmethod
    def get_sprite_votes(cls, id_):
        func = Code("function(cur, result){result.votes += cur['" + id_ +"']}")
        query = cls.group(
            key={},
            condition={id_: {'$exists': True}},
            initial={'votes': 0},
            reduce=func,
        )

        if len(query) == 0:
            return 0
        return query[0]['votes']

    #
    # API Endpoints
    #

    @classmethod
    def get(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    @required('id', 'vote')
    def post(cls, endpoint):
        id_ = cls.get_arg('id')
        sprite = Sprite.find_one({'id': id_})
        if not sprite or id_ == 'ip':
            return json_response({'id': 'invalid_id'}, code=400)

        ip = get_ip()

        vote = int(cls.get_arg('vote'))
        if vote in [-1, 0, 1]:
            cls.get_or_create(**{
                'ip': ip,
                id_: vote,
            })
        return {'votes': cls.get_sprite_votes(id_)}

    @classmethod
    def patch(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    def delete(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)
