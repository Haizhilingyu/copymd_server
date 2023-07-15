const router = require('koa-router')()
const {marked} = require('marked');

const cache = new Map(); // 声明一个Map对象用于缓存数据
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
  })
})
function isStringNotEmpty(str) {
  return str.trim() !== '';
}

router.post('/url', async (ctx, next) => {
  const { markdown, url, password } = JSON.parse(ctx.request.body);
  console.log(markdown, url, password);
  if (isStringNotEmpty(markdown) && isStringNotEmpty(url) && isStringNotEmpty(password)) {
    if (cache.has(url)) {
      const cacheData = cache.get(url);
      const { pass } = cacheData;
      if (password !== pass) {
        ctx.body = '{"code":500,"message":"密码错误"}';
        return
      }
    }
    console.log(markdown, url, password);
    saveData(markdown, url, password);
    console.log(cache);
    ctx.body = '{"code":200,"message":"存储成功"}';
  } else {
    ctx.body = '{"code":500,"message":"存储失败"}';
  }
})

function saveData(markdown, url, password) {
  const expiration = Date.now() + 20 * 60 * 1000; // 计算过期时间
  // 将markdown和password存入缓存
  cache.set(url, { markdown, password, expiration });
}

// 获取缓存数据，并检查是否过期
router.get('/:url', async (ctx) => {
  const url = ctx.params.url;
  console.log(url);
  console.log(cache);
  if (cache.has(url)) {
    const cacheData = cache.get(url);
    const { markdown, expiration } = cacheData;

    if (expiration > Date.now()) {
      await ctx.render('preview', { content: marked(markdown) });
    } else {
      // 缓存已过期，从缓存中删除
      cache.delete(url);
      await ctx.render('error');
    }
  } else {
    await ctx.render('error');
  }
});

module.exports = router
