const router = require('koa-router')()
const { marked } = require('marked');

const cache = new Map(); // 声明一个Map对象用于缓存数据
const expirationTime = 20 * 60 * 1000; // 过期时间

// 清理过期数据的函数
function clearExpiredData() {
  const currentTime = Date.now();
  
  for (const [url, data] of cache.entries()) {
    const { expiration } = data;
    if (expiration <= currentTime) {
      cache.delete(url);
    }
  }
}

// 每隔一定时间清理过期数据
setInterval(clearExpiredData, 5 * 60 * 1000); // 每隔 5 分钟清理一次

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
  })
})
function isStringNotEmpty(str) {
  return str.trim() !== '';
}

router.post('/url', async (ctx, next) => {
  const { markdown, url, password } = JSON.parse(ctx.request.body);
  if (isStringNotEmpty(markdown) && isStringNotEmpty(url) && isStringNotEmpty(password)) {
    if (cache.has(url)) {
      const cacheData = cache.get(url);
      if (password === cacheData.password) {
        saveData(markdown, url, password);
        console.log(url);
        ctx.body = '{"code":200,"data":{"url":"' + url + '"},"message":"Save Success!"}';
      } else {
        ctx.body = '{"code":500,"message":"Incorrect password."}';
      }
    } else {
      saveData(markdown, url, password);
      ctx.body = '{"code":200,"data":{"url":"' + url + '"},"message":"Save Success!"}';
    }
  } else {
    ctx.body = '{"code":500,"message":"Save Error!"}';
  }
})

function saveData(markdown, url, password) {
  const expiration = Date.now() + expirationTime; // 计算过期时间
  // 将markdown和password存入缓存
  cache.set(url, { markdown, password, expiration });
}

// 获取缓存数据，并检查是否过期
router.get('/:url', async (ctx) => {
  const url = ctx.params.url;
  if (cache.has(url)) {
    const cacheData = cache.get(url);
    const { markdown, expiration } = cacheData;

    if (expiration > Date.now()) {
      await ctx.render('preview', { content: marked(markdown) });
    } else {
      // 缓存已过期，从缓存中删除
      cache.delete(url);
      await ctx.render('error',{
        message: "Page not found.",
        error:{
          status: 404,
          stack: ""
        }
      });
    }
  } else {
    await ctx.render('error',{
      message: "Page not found.",
      error:{
        status: 404,
        stack: ""
      }
    });
  }
});

module.exports = router
