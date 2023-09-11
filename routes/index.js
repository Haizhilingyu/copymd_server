import {kv} from '@vercel/kv';

const router = require('koa-router')()
const { marked } = require('marked');

router.get('/', async (ctx, next) => {
  // 获取当前请求的 URL 查询参数对象
  const queryParams = ctx.request.query;
  let { markdown, url } = { markdown: "", url: "" };
  // 检查是否存在请求参数
  // 检查缓存中是否存在指定的 URL 的值

  if (Object.keys(queryParams).length > 0 && queryParams.url) {
    markdown = await kv.hget(queryParams.url, "markdown");
    url = queryParams.url;
  }
  await ctx.render('index', {
    markdown,
    url,
  })
})
function isStringNotEmpty(str) {
  return str.trim() !== '';
}

router.post('/url', async (ctx, next) => {
  const { markdown, url, password } = JSON.parse(ctx.request.body);
  if (isStringNotEmpty(markdown) && isStringNotEmpty(url) && isStringNotEmpty(password)) {
    const md = await kv.hget(url, "markdown")
    if (md) {
      const pass = await kv.hget(url, "password")
      if (password === pass) {
        await saveData(markdown, url, password);
        console.log(url);
        ctx.body = '{"code":200,"data":{"url":"' + url + '"},"message":"Save Success!"}';
      } else {
        ctx.response.status = 500;
        ctx.body = 'Incorrect password.';
      }
    } else {
      await saveData(markdown, url, password);
      ctx.body = '{"code":200,"data":{"url":"' + url + '"},"message":"Save Success!"}';
    }
  } else {
    ctx.response.status = 500;
    ctx.body = 'Save Error.';
  }
})

async function saveData(markdown, url, password) {
  await kv.hset(url, { markdown, password });
}

// 获取缓存数据，并检查是否过期
router.get('/:url', async (ctx) => {
  const url = ctx.params.url;
  const md = await kv.hget(url, "markdown")
  if (md) {
    await ctx.render('preview', { content: marked(md), markdown:md });
  } else {
    await ctx.render('error', {
      message: "Page not found.",
      error: {
        status: 404,
        stack: ""
      }
    });
  }
});

module.exports = router
