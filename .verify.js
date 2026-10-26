async (page) => {
  const b = page.context().browser();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
  const p = await ctx.newPage();
  await p.goto('https://github.com/hirun-2542/barber-booking', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const top = await p.evaluate(() => {
    const art = document.querySelector('article.markdown-body');
    const hero = art.querySelector('img');
    return { heroOk: hero && hero.complete && hero.naturalWidth > 0, heroW: hero && hero.naturalWidth, scrollWidth: document.documentElement.scrollWidth, inner: innerWidth };
  });
  await p.evaluate(() => { const h = [...document.querySelectorAll('h2')].find((x) => x.textContent.includes('สถาปัตยกรรม')); h && h.scrollIntoView(); });
  await p.waitForTimeout(2000);
  await p.screenshot({ path: '.gh-arch.png' });
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: '.gh-top.png' });
  await ctx.close();
  return JSON.stringify(top);
}
