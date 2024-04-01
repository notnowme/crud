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

    test('댓글 작성 - 게시글 없음', async() => {
        const data = { content: 'abc', boardNo: 1 }
        const res = await request(app)
            .post('/api/comment/free')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.message).toBe('Not Found')
    });

    test('댓글 작성 - 게시글 번호 없음', async() => {
        const data = { content: 'aa' }
        const res = await request(app)
            .post('/api/comment/free')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.message).toBe('Board No missing')
    });

    test('댓글 작성 - 내용 없음', async() => {
        const data = { boardNo: 45 }
        const res = await request(app)
            .post('/api/comment/free')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.message).toBe('CONTENT missing')
    });

    test('댓글 작성 - 성공', async() => {
        const data = { content:'abc', boardNo: 45 }
        const res = await request(app)
            .post('/api/comment/free')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.ok).toBe(true)
    });

    test('댓글 수정 - 댓글 없음', async() => {
        const data = { content:'abc' }
        const res = await request(app)
            .patch('/api/comment/free/1')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.message).toBe('Not Found')
    });

    test('댓글 수정 - 내용 없음', async() => {
        const res = await request(app)
            .patch('/api/comment/free/12')
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.message).toBe('CONTENT missing')
    });

    test('댓글 수정 - 유저 불일치', async() => {
        const data = { content:'abc' }
        const res = await request(app)
            .patch('/api/comment/free/12')
            .send(data)
            .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJubyI6NCwiaWQiOiJ0ZXN0MDMiLCJuaWNrIjoi7IiY7KCV65CcIOuLieuEpOyehDMiLCJpYXQiOjE3MTE5NDY4NzgsImV4cCI6MTcxMTk1MDQ3OCwianRpIjoiZmNhNjk3MjAtZjU3Ni00YjRlLTk2MmMtZTMxZmZhNDlhMGM3In0.cT1soEOgAlH8KMpSkPDfCw4M_tNNG3Pa6c0pRzCnRWs')
            .set('Accept','application/json')

        expect(res.body.message).toBe('No Author')
    });

    test('댓글 수정 - 성공', async() => {
        const data = { content:'abc' }
        const res = await request(app)
            .patch('/api/comment/free/12')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.ok).toBe(true)
    });

    test('댓글 삭제 - 유저 불일치', async() => {
        const res = await request(app)
            .delete('/api/comment/free/12')
            .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJubyI6NCwiaWQiOiJ0ZXN0MDMiLCJuaWNrIjoi7IiY7KCV65CcIOuLieuEpOyehDMiLCJpYXQiOjE3MTE5NDY4NzgsImV4cCI6MTcxMTk1MDQ3OCwianRpIjoiZmNhNjk3MjAtZjU3Ni00YjRlLTk2MmMtZTMxZmZhNDlhMGM3In0.cT1soEOgAlH8KMpSkPDfCw4M_tNNG3Pa6c0pRzCnRWs')
            .set('Accept','application/json')

        expect(res.body.message).toBe('No Author')
    });

    test('댓글 삭제 - 댓글 없음', async() => {
        const res = await request(app)
            .delete('/api/comment/free/1')
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.message).toBe('Not Found')
    });

    test('댓글 삭제 - 성공', async() => {
        const data = { content:'abc' }
        const res = await request(app)
            .delete('/api/comment/free/12')
            .send(data)
            .set('Authorization', token)
            .set('Accept','application/json')

        expect(res.body.ok).toBe(true)
    });

    afterAll(() => {
        server.close();
    });
});