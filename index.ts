import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 8081; // 포트를 8081로 변경했습니다.

const GITHUB_TOKEN = '창연님_토큰_여기에';
const REPO_OWNER = 'lisyoen';
const REPO_NAME = 'blog';

async function fetchDiscussions() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/discussions`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const response = await axios.get(url, { headers });
  return response.data;
}

app.get('/posts', async (req, res) => {
  try {
    const discussions = await fetchDiscussions();
    const html = discussions.map((d: any) => `<li><a href="${d.html_url}" target="_blank">${d.title}</a></li>`).join('');
    res.send(`<html><body><h1>블로그 글 목록</h1><ul>${html}</ul></body></html>`);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).send('Error fetching discussions');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
