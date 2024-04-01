import request from "supertest";
import { app, server } from '../index';

// /api/search?board=&cat=&key=&page=&
describe('[FREE]', () => {
    test('검색 - 게시판 미지정', async() => {
        const query = 'cat=title&key=01&page=1'
        const res = await request(app)
            .get('/api/search')
            .query(query)
        expect(res.body.message).toBe('Board missing')
    });
    test('검색 - 카테고리 미지정', async() => {
        const query = 'board=free&key=01&page=1'
        const res = await request(app)
            .get('/api/search')
            .query(query)
        expect(res.body.message).toBe('Category missing')
    });
    test('검색 - 검색어 미지정', async() => {
        const query = 'board=free&cat=title&page=1'
        const res = await request(app)
            .get('/api/search')
            .query(query)
        expect(res.body.message).toBe('Keyword missing')
    });
    test('검색 - 페이지 미지정', async() => {
        const query = 'board=free&cat=title&key=01'
        const res = await request(app)
            .get('/api/search')
            .query(query)
        expect(res.body.message).toBe('Page missing')
    });

    test('검색 - 게시글 없음', async() => {
        const query = 'board=free&cat=title&key=01&page=1'
        const res = await request(app)
            .get('/api/search')
            .query(query)
        expect(res.body.message).toBe('Not Found')
    });

    test('검색 - 성공', async() => {
        const query = 'board=free&cat=nick&key=04&page=1'
        const res = await request(app)
            .get('/api/search')
            .query(query)
        expect(res.body.ok).toBe(true)
    });

    afterAll(() => {
        server.close();
    });
});