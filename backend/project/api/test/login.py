from project.test.base import BaseTestCase


class LoginTest(BaseTestCase):
    def test_login_get(self):
        self.assertRequest('login-check-denied', 'GET', '/api/login', nocover=['_id'])
        self.assertRequest('register-foobar-user', 'POST', '/api/register', data={
            'email': 'foo@foobar.com',
            'password': 'foobar',
        }, nocover=['_id'])
        self.assertRequest('login-check-successful', 'GET', '/api/login', nocover=['_id'])
        self.assertRequest('login-denied', 'POST', '/api/login', data={
            'email': 'foo@foobar.com',
            'password': 'foobart',
        }, nocover=['_id'])
        self.assertRequest('login-successful', 'POST', '/api/login', data={
            'email': 'foo@foobar.com',
            'password': 'foobar',
        }, nocover=['_id'])
        self.assertRequest('login-check-successful', 'GET', '/api/login', nocover=['_id'])
