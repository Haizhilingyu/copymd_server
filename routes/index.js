const router = require('koa-router')()
const {marked} = require('marked');
const {createClient} = require('@vercel/kv');

const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});
router.get('/', async (ctx, next) => {
    // 获取当前请求的 URL 查询参数对象
    const queryParams = ctx.request.query;
    let {markdown, url} = queryParams;
    // 检查是否存在请求参数
    // 检查缓存中是否存在指定的 URL 的值

    if (Object.keys(queryParams).length > 0 && queryParams.url) {
        const cacheData = await getData(url)
        markdown = cacheData.markdown;
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
    const {markdown, url, password} = JSON.parse(ctx.request.body);
    if (isStringNotEmpty(markdown) && isStringNotEmpty(url) && isStringNotEmpty(password)) {
        const cacheData = await getData(url)
        if (cacheData && cacheData.markdown) {
            if (password === cacheData.password) {
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
    try {
        const expirationTime = 20 * 60 * 1000;
        const expiration = Date.now() + expirationTime;
        await kv.set(url, {markdown, password, expiration}, {ex: expirationTime});
    } catch (error) {
        // Handle errors
    }
}

async function getData(url) {
    return kv.get(url)
}


// 获取缓存数据，并检查是否过期
router.get('/:url', async (ctx) => {
  const url = ctx.params.url;
  console.log(url);
  const cacheData = await getData(url)
  console.log(cacheData)
  if (cacheData && cacheData.markdown) {
      await ctx.render('preview', {content: marked(cacheData.markdown),expiration: cacheData.expiration, markdown: cacheData.markdown});
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
