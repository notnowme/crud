import request from "supertest";
import { app, server } from '../index';

describe('[FREE]', () => {
    let token: string;
    beforeAll(async () => {
        const data = { id: 'test01', password: '1234' }
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json');
        token = res.body.data.token
    });

    test('유저 정보 - 성공', async () => {

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', token)

        expect(res.body.ok).toBe(true)
    });

    test('닉네임 수정 - 닉네임 없음', async () => {

        const res = await request(app)
            .patch('/api/users')
            .set('Authorization', token)

        expect(res.body.message).toBe('NICK missing');
    });

    test('닉네임 수정 - 성공', async () => {
        const data = { nick: '수정된 닉네임99'}
        const res = await request(app)
            .patch('/api/users')
            .send(data)
            .set('Authorization', token)
            .set('Accept', 'application/json')

        expect(res.body.ok).toBe(true);
    });

    afterAll(() => {
        server.close();
    });
});