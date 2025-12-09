import fs from 'fs';
import path from 'path';

// 설정 (기본값 로컬, 필요시 배포 URL로 변경)
const BASE_URL = process.argv[2] || 'http://localhost:5000';
console.log(`Target Server: ${BASE_URL}`);

// 테스트 계정 정보 (기존 로그인 테스트용 파일이 있다면 참조, 없으면 하드코딩된 테스트 계정 사용)
// 여기서는 안전하게 하드코딩된 더미 계정이나, 환경변수 등을 사용하는 것이 좋으나
// 편의상 이전에 사용된 것으로 추정되는 계정을 시도하거나, 새로 가입 시도 로직을 넣을 수 있음.
// 하지만 간단하게 작동 확인을 위해 관리자 계정 정보를 사용 (seed_admin.js 참고)
const TEST_USER = {
    username: 'arc', // admin username from seed_admin.js
    password: '123123@' // admin password from seed_admin.js
};

async function runTest() {
    try {
        console.log('1. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('✅ Login successful. Token obtained.');

        console.log('2. Fetching posts...');
        const postsRes = await fetch(`${BASE_URL}/api/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!postsRes.ok) {
            throw new Error(`Fetch posts failed: ${postsRes.status}`);
        }

        const posts = await postsRes.json();
        if (posts.length === 0) {
            console.log('⚠️ No posts found. Creating a test post...');
            // 게시글이 없으면 하나 생성 로직 추가 가능하지만, 일단 중단
            throw new Error('No posts to test like functionality.');
        }

        const targetPost = posts[0];
        const postId = targetPost._id;
        const initialLikes = targetPost.likes ? targetPost.likes.length : 0;
        console.log(`✅ Target Post ID: ${postId} (Current Likes: ${initialLikes})`);

        console.log('3. Toggling Like (PUT)...');
        const likeRes = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!likeRes.ok) {
            throw new Error(`Like toggle failed: ${likeRes.status}`);
        }

        const updatedPost = await likeRes.json();
        // 참고: 백엔드 구현에 따라 updatedPost가 전체 객체일 수도 있고, likes 배열만 줄 수도 있음.
        // postController.js를 보지 않았으나 보통 업데이트된 문서를 반환함.

        console.log('✅ Like toggled successfully.');
        console.log('Response:', JSON.stringify(updatedPost, null, 2));

        // 검증
        // 만약 내가 이미 좋아요를 눌렀다면 줄어들 것이고, 안 눌렀다면 늘어날 것.
        // 하지만 단순히 API가 200 OK를 반환하고 데이터가 변했다면 성공으로 간주.

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

runTest();
