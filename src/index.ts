import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 8081; // 포트를 8081로 변경했습니다.

import dotenv from 'dotenv';
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
const REPO_OWNER = process.env.REPO_OWNER as string;
const REPO_NAME = process.env.REPO_NAME as string;

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

    let html = `
      <h1 style="text-align:center;">블로그 글 목록</h1>
      <div style="display:flex; flex-direction:column; align-items:center;">
    `;

    discussions.forEach((discussion: any) => {
      const plainText = discussion.bodyHTML
        ? discussion.bodyHTML.replace(/<[^>]+>/g, '')
        : '';

      const previewText = plainText.substring(0, 100) || 'No content available.';

      html += `
        <div style="border:1px solid #ccc; border-radius:8px; padding:16px; margin:16px; width:600px; box-shadow:2px 2px 12px rgba(0,0,0,0.1);">
          <div style="display:flex; align-items:center;">
            <img src="https://placehold.co/80x80" style="width:80px; height:80px; border-radius:8px; margin-right:16px;">
            <div style="flex-grow:1;">
              <a href="${discussion.url}" target="_blank" style="font-size:20px; font-weight:bold; color:#007acc; text-decoration:none;">
                ${discussion.title}
              </a>
              <p style="margin-top:8px; font-size:14px; color:#555;">
                ${previewText}
              </p>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching discussions');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
