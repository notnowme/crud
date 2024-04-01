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

    test('페이지 번호 없음', async() => {
        const res = await request(app)
            .get('/api/board/free')
        expect(res.body.message).toBe('Page No missing')
    });

    test('게시글 없음', async() => {
        const res = await request(app)
            .get('/api/board/free?page=99')
        expect(res.body.message).toBe('Not Found')
    });

    test('페이지 1 게시글', async() => {
        const res = await request(app)
            .get('/api/board/free?page=1')
        expect(res.body.ok).toBe(true)
    });

    test('게시글 번호 오류', async() => {
        const res = await request(app)
            .get('/api/board/free/a')
        expect(res.body.message).toBe('Internel Server Error');
    });

    test('게시글 번호의 글 없음', async() => {
        const res = await request(app)
            .get('/api/board/free/2')
        expect(res.body.message).toBe('Not Found')
    });

    test('게시글 번호의 글', async() => {
        const res = await request(app)
            .get('/api/board/free/45')
        expect(res.body.ok).toBe(true)
    });

    
    test('게시글 작성 - 제목 없음', async () => {
        const data = { content: 'bbb' }
        
        const res = await request(app)
        .post('/api/board/free')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.message).toBe('TITLE missing')
    });

    test('게시글 작성 - 내용 없음', async () => {
        const data = { title: 'bbb' }
        
        const res = await request(app)
        .post('/api/board/free')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.message).toBe('CONTENT missing')
    });

    test('게시글 작성 - 성공', async () => {
        const data = { title: 'bbb', content: 'aaa' }
        
        const res = await request(app)
        .post('/api/board/free')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.ok).toBe(true)
    });

    test('게시글 수정 - 제목 없음', async () => {
        const data = { content: 'aaa' }
        
        const res = await request(app)
        .put('/api/board/free/50')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.message).toBe('TITLE missing')
    });

    test('게시글 수정 - 내용 없음', async () => {
        const data = { title: 'aaa' }
        
        const res = await request(app)
        .put('/api/board/free/50')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.message).toBe('CONTENT missing')
    });

    test('게시글 수정 - 게시글 없음', async () => {
        const data = { title: 'aaa', content: 'bbb' }
        
        const res = await request(app)
        .put('/api/board/free/1')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.message).toBe('Cannot find Board with 1')
    });
    
    test('게시글 수정 - 유저 불일치', async () => {
        const data = { title: 'aaa', content: 'bbb' }
        
        const res = await request(app)
        .put('/api/board/free/52')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJubyI6NCwiaWQiOiJ0ZXN0MDMiLCJuaWNrIjoi7IiY7KCV65CcIOuLieuEpOyehDMiLCJpYXQiOjE3MTE5NDY4NzgsImV4cCI6MTcxMTk1MDQ3OCwianRpIjoiZmNhNjk3MjAtZjU3Ni00YjRlLTk2MmMtZTMxZmZhNDlhMGM3In0.cT1soEOgAlH8KMpSkPDfCw4M_tNNG3Pa6c0pRzCnRWs')
        expect(res.body.message).toBe('No Author')
    });

    test('게시글 수정 - 성공', async () => {
        const data = { title: 'aaa', content: 'bbb' }
        
        const res = await request(app)
        .put('/api/board/free/52')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        expect(res.body.ok).toBe(true)
    });

    test('게시글 삭제 - 유저 불일치', async () => {
        
        const res = await request(app)
        .delete('/api/board/free/52')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJubyI6NCwiaWQiOiJ0ZXN0MDMiLCJuaWNrIjoi7IiY7KCV65CcIOuLieuEpOyehDMiLCJpYXQiOjE3MTE5NDY4NzgsImV4cCI6MTcxMTk1MDQ3OCwianRpIjoiZmNhNjk3MjAtZjU3Ni00YjRlLTk2MmMtZTMxZmZhNDlhMGM3In0.cT1soEOgAlH8KMpSkPDfCw4M_tNNG3Pa6c0pRzCnRWs')
        expect(res.body.message).toBe('No Author')
    });

    test('게시글 삭제 - 게시글 없음', async () => {
        
        const res = await request(app)
        .delete('/api/board/free/1')
        .set('Authorization', token)
        expect(res.body.message).toBe('Cannot find Board with 1')
    });

    test('게시글 삭제 - 성공', async () => {
        
        const res = await request(app)
        .delete('/api/board/free/52')
        .set('Authorization', token)
        expect(res.body.ok).toBe(true)
    });
    afterAll(() => {
        server.close();
    });
});