from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    __import__('os').makedirs('tests/shots', exist_ok=True); b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':900})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route('**/sql-asm.js', lambda r: r.fulfill(path='node_modules/sql.js/dist/sql-asm.js', content_type='application/javascript')); pg.goto('file://'+__import__('os').path.abspath('index.html')+''); pg.wait_for_timeout(1500)
    pg.evaluate("localStorage.setItem('sqlquest-v1', JSON.stringify({name:'Arjun',gems:0,done:{1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1},quiz:{},solved:{},games:{},tries:{}}))")
    pg.reload(); pg.wait_for_timeout(1500)
    # memory
    pg.evaluate("location.hash='#game-1'"); pg.wait_for_timeout(500)
    texts=pg.eval_on_selector_all('.mcard','els=>els.map(e=>e.querySelector(".back").innerText)')
    pairs=pg.evaluate("GAMES[0].pairs")
    idx={t:i for i,t in enumerate(texts)}
    for a,bb in pairs:
        pg.click(f'.mcard[data-i="{idx[a]}"]'); pg.click(f'.mcard[data-i="{idx[bb]}"]'); pg.wait_for_timeout(100)
    pg.wait_for_timeout(900); print('mem', pg.inner_text('.modal')[:60].replace('\n',' '))
    pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
    # order
    pg.evaluate("location.hash='#game-2'"); pg.wait_for_timeout(500)
    for r in range(3):
        n=pg.evaluate(f"GAMES[1].rounds[{r}].length")
        for i in range(n): pg.click(f'.token[data-i="{i}"]')
        pg.wait_for_timeout(1000)
    print('order', pg.inner_text('.modal')[:60].replace('\n',' '))
    pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
    pg.evaluate("location.hash='#game-3'"); pg.wait_for_timeout(500)
    for a in pg.evaluate("GAMES[2].rounds.map(r=>r.a)"):
        pg.fill('#jin',str(a)); pg.click('#jgo'); pg.click('#jnext'); pg.wait_for_timeout(200)
    pg.wait_for_timeout(500); print('join', pg.inner_text('.modal')[:60].replace('\n',' '))
    pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
    pg.evaluate("location.hash='#game-4'"); pg.wait_for_timeout(500)
    for a in pg.evaluate("GAMES[3].rounds.map(r=>r.a)"):
        pg.fill('#tin',a); pg.click('#tgo'); pg.click('#tnext'); pg.wait_for_timeout(200)
    pg.wait_for_timeout(500); print('teaser', pg.inner_text('.modal')[:60].replace('\n',' '))
    pg.screenshot(path='tests/shots/teaserwin.png')
    pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
    pg.evaluate("location.hash='#game-5'"); pg.wait_for_timeout(500); pg.click('#bgo')
    for k in range(20):
        q=pg.inner_text('#bq'); ans=pg.evaluate(f"GAMES[4].items.find(x=>x[0]==={q!r})[1]")
        pg.click('#bT' if ans else '#bF')
    pg.wait_for_timeout(800); pg.screenshot(path='tests/shots/cert.png'); print('cert', pg.inner_text('.cert')[:120].replace('\n',' '))
    print('ERRS',errs); b.close()
