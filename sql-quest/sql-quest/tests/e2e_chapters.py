from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    __import__('os').makedirs('tests/shots', exist_ok=True); b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':900})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
    pg.route('**/sql-asm.js', lambda r: r.fulfill(path='node_modules/sql.js/dist/sql-asm.js', content_type='application/javascript')); pg.goto('file://'+__import__('os').path.abspath('index.html')+''); pg.wait_for_timeout(2500)
    pg.screenshot(path='tests/shots/welcome.png')
    pg.fill('#nm','Arjun'); pg.click('#go'); pg.wait_for_timeout(800)
    pg.screenshot(path='tests/shots/home.png',full_page=True)
    # check every chapter solution passes and examples run
    res=pg.evaluate("""() => { const out=[]; for(const c of CHAPTERS){ location.hash='#ch-'+c.id; } return 1 }""")
    for c in range(1,11):
        pg.evaluate(f"location.hash='#ch-{c}'"); pg.wait_for_timeout(400)
        # run all try buttons
        n=pg.eval_on_selector_all('.trybtn','els=>{els.forEach(e=>e.click());return els.length}')
        pg.wait_for_timeout(300)
        bad=pg.eval_on_selector_all('.codebox .err','els=>els.map(e=>e.closest(".codebox").querySelector("pre").innerText.slice(0,60)+" :: "+e.innerText.slice(0,80))')
        sol=pg.evaluate(f"CHAPTERS[{c-1}].challenge.solution")
        pg.fill('#chEditor',sol); pg.click('#chCheck'); pg.wait_for_timeout(300)
        msg=pg.inner_text('#chMsg')
        # answer quiz correctly
        qs=pg.evaluate(f"CHAPTERS[{c-1}].quiz.map(q=>q.a)")
        for i,a in enumerate(qs): pg.click(f'#quiz .q[data-i="{i}"] .opt[data-j="{a}"]')
        pg.wait_for_timeout(200)
        if c in (1,6): pg.screenshot(path=f'tests/shots/ch{c}.png',full_page=True)
        pg.click('#claim'); pg.wait_for_timeout(500)
        if c==2: pg.screenshot(path='tests/shots/modal.png')
        pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
        print(c,n,'examples; errors:',bad,'| check:',msg[:40])
    pg.evaluate("location.hash='#home'"); pg.wait_for_timeout(600); pg.screenshot(path='tests/shots/home_done.png',full_page=True)
    for gid in range(1,6):
        pg.evaluate(f"location.hash='#game-{gid}'"); pg.wait_for_timeout(500); pg.screenshot(path=f'tests/shots/game{gid}.png')
    pg.evaluate("location.hash='#cheatsheet'"); pg.wait_for_timeout(500)
    print('ERRS',errs[:10])
    b.close()
