import os
from datetime import datetime

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
        # TODO: To be refactored
        id_ = cls.get_arg('id')
        if id_:
            sprite = cls.find_one({'id': id_})
            sprite['vote'] = SpriteVote.get_vote(sprite['id'])
            sprite['votes'] = SpriteVote.get_sprite_votes(sprite['id'])
            if not sprite:
                return json_response({'error': 'not found'}, code=404)
            return sprite

        offset = int(cls.get_arg('offset', 0))
        limit = min(int(cls.get_arg('limit', 15)), 15)

        sort = cls.get_arg('sort', 'top')
        if sort == 'top':
            return SpriteVote.get_top(offset, limit)

        cursor = cls.find({}).sort('created_on', cls.DESCENDING)
        cursor = cursor.skip(offset).limit(limit)
        retval = list(cursor)
        for s in retval:
            s['vote'] = SpriteVote.get_vote(s['id'])
            s['votes'] = SpriteVote.get_sprite_votes(s['id'])
        return retval

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
        SpriteVote.get_or_create(ip=get_ip(), id=id_, vote=1)
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
        {'ip', 'id'},
    ]

    @classmethod
    def get_vote(cls, id_, ip=None):
        if not ip:
            ip = get_ip()
        return cls.get_or_create(ip=ip, id=id_).get('vote', 0)

    @classmethod
    def get_sprite_votes(cls, id_):
        query = list(cls.aggregate([
            {
                '$match': {'id': id_},
            },
            {
                '$group': {'_id': '$id', 'votes': {'$sum': '$vote'}},
            },
        ]))
        if len(query) == 0:
            return 0
        return query[0].get('votes', 0)

    @classmethod
    def get_top(cls, offset, limit):
        query = cls.aggregate([
            {
                '$group': {'_id': '$id', 'votes': {'$sum': '$vote'}},
            },
            {
                '$sort': {'votes': cls.DESCENDING},
            },
            {'$skip': offset},
            {'$limit': limit},
            {
                '$lookup': {
                    'from': 'sprite',
                    'localField': '_id',
                    'foreignField': 'id',
                    'as': 'sprite',
                },
            },
        ])

        retval = []
        for r in query:
            sprite = r['sprite'][0]
            sprite['votes'] = r['votes']
            sprite['vote'] = cls.get_vote(sprite['id'])
            retval.append(sprite)
        return retval


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
        ip = get_ip()
        vote = int(cls.get_arg('vote'))
        if vote in [-1, 0, 1]:
            cls.get_or_create(ip=ip, id=id_, vote=vote)
        return {'votes': cls.get_sprite_votes(id_)}

    @classmethod
    def patch(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)

    @classmethod
    def delete(cls, endpoint):
        return json_response({'error': 'not authorized'}, code=401)
