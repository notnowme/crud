import request from "supertest";
import { app, server } from '../index';

describe('[AUTH]', () => {

    test('회원가입 - 아이디 중복', async () => {
        const data = { id: 'test01', nick: '테스트01', password: '1234'}
        const res = await request(app)
            .post('/api/auth/local/join')
            .send(data)
            .set('Accept', 'application/json')
        expect(res.body.message).toBe('ID exists!');
    });

    test('회원가입 - 닉네임 중복', async () => {
        const data = { id: 'test99', nick: '테스트01', password: '1234'}
        const res = await request(app)
            .post('/api/auth/local/join')
            .send(data)
            .set('Accept', 'application/json')


        expect(res.body.message).toBe('NICK exists!');
    });

    test('회원가입 - 아이디 미입력', async () => {
        const data = { nick: '테스트01', password: '1234'}
        const res = await request(app)
            .post('/api/auth/local/join')
            .send(data)
            .set('Accept', 'application/json')


        expect(res.body.message).toBe('ID missing');
    });

    test('회원가입 - 닉네임 미입력', async () => {
        const data = { id: 'test99', password: '1234'}
        const res = await request(app)
            .post('/api/auth/local/join')
            .send(data)
            .set('Accept', 'application/json')


        expect(res.body.message).toBe('NICK missing');
    });

    test('회원가입 - 비밀번호 미입력', async () => {
        const data = { id: 'test99', nick: 'test99' }
        const res = await request(app)
            .post('/api/auth/local/join')
            .send(data)
            .set('Accept', 'application/json')


        expect(res.body.message).toBe('PASSWORD missing');
    });

    test('회원가입 - 성공', async () => {
        const data = { id: 'test99', nick: 'test99', password: "1234" }
        const res = await request(app)
            .post('/api/auth/local/join')
            .send(data)
            .set('Accept', 'application/json')


        expect(res.body.ok).toBe(true);
    });

    test('로그인 - 아이디 미입력', async() => {
        const data = { password: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json')

        expect(res.body.message).toBe('ID missing');
    });

    test('로그인 - 비밀번호 미입력', async() => {
        const data = { id: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json')

        expect(res.body.message).toBe('PASSWORD missing');
    });

    test('로그인 - 없는 아이디', async() => {
        const data = { id: '1234', password: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json')

        expect(res.body.message).toBe('Cannot find User');
    });

    test('로그인 - 틀린 비밀번호', async() => {
        const data = { id: 'test01', password: '123'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json')

        expect(res.body.message).toBe('Wrong Password');
    });

    test('로그인 - 성공', async() => {
        const data = { id: 'test99', password: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json')

        expect(res.body.ok).toBe(true);
    });

    test('탈퇴 - 토큰 없음', async() => {
        const data = { id: 'test99', password: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json');
        
        const token = res.body.data.token;

        const result = await request(app)
            .post('/api/auth/local/withdraw')

        expect(result.body.message).toBe('Unauthorized');
    });

    test('탈퇴 - 이상한 토큰', async() => {
        const data = { id: 'test99', password: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json');
        
        const token = res.body.data.token + 'abc';

        const result = await request(app)
            .post('/api/auth/local/withdraw')
            .set('Authorization', token)

        expect(result.body.message).toBe('Invalid Token');
    });

    test('탈퇴 - 성공', async() => {
        const data = { id: 'test99', password: '1234'}
        const res = await request(app)
            .post('/api/auth/login')
            .send(data)
            .set('Accept', 'application/json');
        
        const token = res.body.data.token;

        const result = await request(app)
            .post('/api/auth/local/withdraw')
            .set('Authorization', token)

        expect(result.body.ok).toBe(true);
    });

    afterAll(() => {
        server.close();
    });
});