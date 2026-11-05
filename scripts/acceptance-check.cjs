const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ADELA_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
process.chdir(root);
const out = 'doc/acceptance-screenshots';
fs.mkdirSync(out, {recursive:true});
const report = {date:new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Ho_Chi_Minh'}).format(new Date()), status:'failed', browser:'Installed Chrome headless; real CDN requests', checks:[], html:[], layouts:[], filePages:[], errors:[], cdn:[]};
const server=http.createServer((req,res)=>{
  if(req.url==='/favicon.ico'){res.writeHead(204).end();return;}
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png'}[path.extname(file)]||'application/octet-stream');res.end(data);
  });
});
async function check(name, run){await run();report.checks.push({name,result:'pass'});console.log('PASS '+name);}
async function dismiss(page){await page.locator('.swal2-confirm').click();await page.waitForFunction(()=>!document.querySelector('.swal2-container'));}
async function capture(page, file){await page.waitForTimeout(750);await page.screenshot({path:out+'/'+file});}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({...(process.env.ADELA_CHROME_PATH ? {executablePath:process.env.ADELA_CHROME_PATH} : {channel:'chrome'}),headless:true});
  try{
    for(const name of ['index','about','product']){
      const page=await browser.newPage({viewport:{width:375,height:900}});
      page.on('pageerror',e=>report.errors.push({page:name,type:'pageerror',message:e.message}));
      page.on('console',m=>{if(m.type()==='error')report.errors.push({page:name,type:'console',message:m.text()});});
      page.on('requestfailed',r=>report.errors.push({page:name,type:'requestfailed',url:r.url(),message:r.failure().errorText}));
      page.on('response',r=>{if(r.status()>=400)report.errors.push({page:name,type:'http',url:r.url(),status:r.status()});if(r.url().includes('cdn.jsdelivr.net'))report.cdn.push({page:name,url:r.url(),status:r.status()});});
      await page.goto(origin+'/html/'+name+'.html',{waitUntil:'networkidle'});
      await check(name+': real libraries',async()=>{
        assert.equal(await page.evaluate(()=>typeof Swal.fire),'function');
        assert.equal(await page.evaluate(()=>typeof Swiper),'function');
        assert.match(await page.evaluate(()=>Swal.version),/^11\./);
      });
      const markup = await page.evaluate(() => {
        const controls = Array.from(document.querySelectorAll('input,select,textarea'));
        const ids = Array.from(document.querySelectorAll('[id]'), el => el.id);
        return {
          doctype: document.doctype?.name, lang: document.documentElement.lang,
          charset: document.characterSet, viewport: document.querySelector('meta[name="viewport"]')?.content,
          h1: document.querySelectorAll('h1').length,
          landmarks: ['header','nav','main','section','footer'].filter(tag => document.querySelector(tag)),
          images: document.images.length, controls: controls.length,
          missingAlts: Array.from(document.images).filter(el => !el.alt.trim()).map(el => el.src),
          missingLabels: controls.filter(el => !el.id || !Array.from(el.labels || []).some(label => label.htmlFor === el.id)).map(el => el.outerHTML),
          unnamedForms: Array.from(document.forms).filter(el => !el.getAttribute('aria-label')?.trim()).length,
          duplicateIds: ids.filter((id,i) => ids.indexOf(id) !== i),
          inlineHandlers: Array.from(document.querySelectorAll('*')).flatMap(el => Array.from(el.attributes).filter(a => /^on/i.test(a.name)).map(a => a.name)),
          table: document.querySelector('.spec-table') ? {caption: !!document.querySelector('.spec-table caption'), rows:document.querySelectorAll('.spec-table tbody tr').length, headers:document.querySelectorAll('.spec-table th[scope="row"]').length} : null
        };
      });
      const source = fs.readFileSync(path.join(root, 'html', name+'.html'), 'utf8');
      markup.inlineStyles = (source.match(/\sstyle\s*=|<style\b/gi) || []).length;
      report.html.push({page:name,...markup});
      await check(name+': HTML semantics, labels, images and table', async()=>{
        assert.equal(markup.doctype,'html'); assert.equal(markup.lang,'vi'); assert.equal(markup.charset,'UTF-8');
        assert.match(markup.viewport,/width=device-width/); assert.equal(markup.h1,1); assert.equal(markup.landmarks.length,5);
        assert.deepEqual(markup.missingAlts,[]); assert.deepEqual(markup.missingLabels,[]); assert.deepEqual(markup.duplicateIds,[]);
        assert.equal(markup.unnamedForms,0);
        assert.equal(markup.inlineStyles,0); assert.deepEqual(markup.inlineHandlers,[]);
        if(name==='product'){assert.ok(markup.table.caption); assert.equal(markup.table.rows,9); assert.equal(markup.table.headers,9);}
      });
      await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all(Array.from(document.images,img=>img.decode()));});
      for(const width of [375,430,768,1366,1920]){
        await page.setViewportSize({width,height:900});
        await page.waitForTimeout(400);
        const layout=await page.evaluate(()=>{
          const w=document.documentElement.clientWidth;
          return {scrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth,
            overflow:Array.from(document.querySelectorAll('body *')).filter(el=>{
              if(el.closest('.nav-menu,.swiper-wrapper,.visually-hidden,.swiper-notification'))return false;
              const r=el.getBoundingClientRect(),s=getComputedStyle(el);
              return r.width>0&&s.display!=='none'&&s.visibility!=='hidden'&&(r.right>w+1||r.left < -1);
            }).map(el=>el.tagName+'.'+el.className),
            overflowX:getComputedStyle(document.body).overflowX,
            slider:document.querySelector('.swiper')?.swiper?.params.slidesPerView||null};
        });
        report.layouts.push({page:name,width,...layout});
        assert.equal(layout.scrollWidth,width);
        assert.ok(layout.bodyScrollWidth<=width);
        assert.deepEqual(layout.overflow,[]);
        assert.equal(layout.overflowX,'hidden');
        await page.screenshot({path:out+'/'+name+'-'+width+'.png',fullPage:true});
        if(name==='product')assert.equal(layout.slider,width<600?2:width<1024?3:5);
        if(name==='index')assert.equal(layout.slider,width<1024?1:2);
      }
      await page.setViewportSize({width:375,height:900});
      await check(name+': menu open, overlay, Escape and resize',async()=>{
        await page.locator('#hamburger-btn').click();
        await page.waitForTimeout(350);
        assert.equal(await page.locator('#nav-menu').evaluate(el=>el.classList.contains('open')),true);
        assert.equal(await page.locator('#nav-overlay').evaluate(el=>el.classList.contains('active')),true);
        assert.equal(await page.evaluate(()=>getComputedStyle(document.body).overflowY),'hidden');
        await page.locator('#nav-overlay').click({position:{x:365,y:300}});
        assert.equal(await page.locator('#hamburger-btn').getAttribute('aria-expanded'),'false');
        await page.locator('#hamburger-btn').click();
        await page.keyboard.press('Escape');
        await page.locator('#hamburger-btn').click();
        await page.setViewportSize({width:1366,height:900});
        await page.waitForTimeout(350);
        assert.equal(await page.locator('main').evaluate(el=>el.inert),false);
        assert.equal(await page.locator('#nav-overlay').evaluate(el=>el.classList.contains('active')),false);
        await page.setViewportSize({width:375,height:900});
      });
      await check(name+': newsletter invalid and valid',async()=>{
        const input=page.locator('#newsletter-email');
        await input.fill('invalid@');
        await page.locator('.newsletter button').click();
        await page.locator('.swal2-icon-error').waitFor();
        await dismiss(page);
        assert.equal(await input.getAttribute('aria-invalid'),'true');
        await input.fill('adela.test@example.com');
        await page.locator('.newsletter button').click();
        await page.locator('.swal2-icon-success').waitFor();
        if(name==='about')await capture(page,'newsletter-success.png');
        await dismiss(page);
        assert.equal(await input.inputValue(),'');
      });
      if(name==='index'){
        await check('countdown: advances, reload retains deadline, expiry stops at zero',async()=>{
          const end=await page.evaluate(()=>sessionStorage.getItem('adela-flash-sale-end'));
          const before=await page.locator('#flash-countdown').textContent();
          await page.waitForTimeout(1200);
          assert.notEqual(await page.locator('#flash-countdown').textContent(),before);
          await page.reload({waitUntil:'networkidle'});
          assert.equal(await page.evaluate(()=>sessionStorage.getItem('adela-flash-sale-end')),end);
          assert.match(await page.locator('#flash-countdown').textContent(),/^\d{2} : \d{2} : \d{2}$/);
          await page.evaluate(()=>sessionStorage.setItem('adela-flash-sale-end',String(Date.now()-1000)));
          await page.reload({waitUntil:'networkidle'});
          assert.equal(await page.locator('#flash-countdown').textContent(),'00 : 00 : 00');
          assert.ok((await page.locator('#flash-sale-status').textContent()).includes('kết thúc'));
          await page.evaluate(()=>sessionStorage.removeItem('adela-flash-sale-end'));
          await page.reload({waitUntil:'networkidle'});
        });
      }
      if(name==='product'){
        await check('gallery: click, keyboard, rapid selection and active border',async()=>{
          const thumbs=page.locator('.thumbnail-item');
          await thumbs.nth(1).click();
          await page.waitForTimeout(400);
          assert.ok((await page.locator('#main-img').getAttribute('src')).endsWith('thumb-2.png'));
          assert.equal(await thumbs.nth(1).getAttribute('aria-pressed'),'true');
          assert.equal(await thumbs.nth(1).evaluate(el=>getComputedStyle(el).borderTopWidth),'2px');
          await thumbs.nth(2).focus();
          await page.keyboard.press('Enter');
          await page.waitForTimeout(400);
          assert.ok((await page.locator('#main-img').getAttribute('src')).endsWith('thumb-3.png'));
          await page.evaluate(()=>{document.querySelectorAll('.thumbnail-item')[0].click();document.querySelectorAll('.thumbnail-item')[3].click();});
          await page.waitForTimeout(500);
          assert.ok((await page.locator('#main-img').getAttribute('src')).endsWith('thumb-4.png'));
          assert.equal(await page.locator('.thumbnail-item.active').count(),1);
          assert.equal(await page.locator('#main-img').evaluate(el=>getComputedStyle(el).opacity),'1');
        });
        await check('color selection: click, keyboard, active border and purchase text',async()=>{
          const colors=page.locator('.color-thumb');
          await colors.nth(1).click();
          assert.equal(await colors.nth(1).getAttribute('aria-pressed'),'true');
          assert.equal(await colors.nth(0).getAttribute('aria-pressed'),'false');
          assert.equal(await page.locator('.color-thumb.active').count(),1);
          assert.equal(await colors.nth(1).evaluate(el=>getComputedStyle(el).borderTopColor),'rgb(224, 0, 0)');
          await page.locator('.btn-buy').click();
          assert.match(await page.locator('.swal2-html-container').textContent(),/Vàng gỗ/);
          await page.locator('.swal2-cancel').click(); await page.waitForFunction(()=>!document.querySelector('.swal2-container'));
          await colors.nth(0).focus(); await page.keyboard.press('Space');
          assert.equal(await colors.nth(0).getAttribute('aria-pressed'),'true');
          assert.equal(await page.locator('.color-thumb.active').count(),1);
        });
        await check('quantity and purchase confirmation/cancel',async()=>{
          assert.equal(await page.locator('[data-quantity="decrease"]').isDisabled(),true);
          await page.evaluate(()=>{for(let i=0;i<1005;i++)document.querySelector('[data-quantity="increase"]').click();});
          assert.equal(await page.locator('#product-qty').inputValue(),'999');
          assert.equal(await page.locator('[data-quantity="increase"]').isDisabled(),true);
          await page.evaluate(()=>{for(let i=0;i<1005;i++)document.querySelector('[data-quantity="decrease"]').click();});
          assert.equal(await page.locator('#product-qty').inputValue(),'1');
          await page.locator('[data-quantity="increase"]').click();
          assert.equal(await page.locator('#product-qty').inputValue(),'2');
          await page.locator('.btn-buy').click();
          assert.match(await page.locator('.swal2-html-container').textContent(),/80\.000\.000/);
          await capture(page,'purchase-confirmation.png');
          await page.locator('.swal2-cancel').click();
          await page.waitForFunction(()=>!document.querySelector('.swal2-container'));
          await page.locator('.btn-buy').click();
          await dismiss(page);
          assert.equal(await page.evaluate(()=>document.activeElement.id),'consult-name');
          await page.waitForTimeout(600);
          const box=await page.locator('#tu-van').boundingBox();
          assert.ok(box.y>=-1&&box.y<150);
        });
        await check('consult: name, phone regex, inline error and success reset',async()=>{
          await page.locator('#consult-name').fill('A');
          await page.locator('#consult-phone').fill('0|12345678');
          await page.locator('#consult-form [type="submit"]').click();
          await page.locator('.swal2-icon-error').waitFor();
          await dismiss(page);
          assert.equal(await page.locator('#consult-name').getAttribute('aria-invalid'),'true');
          for(const value of ['0123456789','091234567','09123456789','030312345678','abcdefghij']){
            await page.locator('#consult-phone').fill(value);
            await page.locator('#consult-phone').blur();
            assert.equal(await page.locator('#consult-phone').getAttribute('aria-invalid'),'true',value);
          }
          for(const value of ['0312345678','0512345678','0712345678','0812345678','0912345678']){
            await page.locator('#consult-phone').fill(value);
            await page.locator('#consult-phone').blur();
            assert.equal(await page.locator('#consult-phone').getAttribute('aria-invalid'),'false',value);
          }
          await page.locator('#consult-name').fill('Nguyễn An');
          await page.locator('#consult-form [type="submit"]').click();
          await page.locator('.swal2-icon-success').waitFor();
          await capture(page,'consult-success.png');
          await dismiss(page);
          assert.equal(await page.locator('#consult-name').inputValue(),'');
          assert.equal(await page.locator('#consult-phone').inputValue(),'');
        });
        await check('reviews: stars, validation, safe DOM insertion, summary and no reload',async()=>{
          const initial=await page.locator('.comment-item').count();
          const navigation=await page.evaluate(()=>performance.timeOrigin);
          await page.locator('.star-option').nth(2).click();
          assert.equal(await page.locator('.star-option.active').count(),3);
          await page.locator('input[name="rating"]:checked').focus();
          await page.keyboard.press('ArrowLeft');
          assert.equal(await page.locator('.star-option.active').count(),2);
          await page.locator('#review-name').fill('An');
          await page.locator('#review-content').fill('Ngắn');
          await page.locator('#review-form [type="submit"]').click();
          await page.locator('.swal2-icon-error').waitFor();await dismiss(page);
          assert.equal(await page.locator('.comment-item').count(),initial);
          await page.locator('#review-content').fill('<img src=x onerror=alert(1)> Sản phẩm rất đẹp!');
          await page.locator('#review-email').fill('invalid');
          await page.locator('#review-form [type="submit"]').click();
          await page.locator('.swal2-icon-error').waitFor();await dismiss(page);
          await page.locator('#review-email').fill('');
          await page.locator('#review-form [type="submit"]').click();
          assert.equal(await page.locator('.comment-item').count(),initial+1);
          assert.equal(await page.locator('.comment-item').first().getAttribute('data-rating'),'2');
          assert.equal(await page.locator('.comment-item').first().locator('.comment-text img').count(),0);
          assert.ok((await page.locator('.comment-item').first().locator('.comment-text').textContent()).includes('<img'));
          assert.equal(await page.evaluate(()=>performance.timeOrigin),navigation);
          assert.ok((await page.locator('.rating-summary').first().textContent()).includes('3 đánh giá'));
          assert.equal(await page.locator('#review-content').inputValue(),'');
          assert.equal(await page.locator('.star-option.active').count(),5);
          await page.waitForTimeout(500);
          await page.screenshot({path:out+'/new-review.png'});
        });
      }
      if(name!=='about'){
        await check(name+': Swiper navigation and touch swipe',async()=>{
          await page.setViewportSize({width:375,height:900});
          const slider=page.locator('.swiper');
          await slider.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
          await slider.locator('.swiper-button-next').click();
          await page.waitForTimeout(450);
          assert.ok(await slider.evaluate(el=>el.swiper.activeIndex>0));
          await slider.locator('.swiper-button-prev').click();
          await page.waitForTimeout(450);
          assert.equal(await slider.evaluate(el=>el.swiper.activeIndex),0);
          const cdp=await page.context().newCDPSession(page);
          await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
          const box=await slider.boundingBox();
          const y=Math.max(20,Math.min(700,box.y+100));
          await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:320,y}]});
          for(const x of [280,230,180,130,70]){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});await page.waitForTimeout(30);}
          await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          await page.waitForTimeout(450);
          assert.ok(await slider.evaluate(el=>el.swiper.activeIndex>0));
          await slider.screenshot({path:out+'/'+name+'-slider-mobile.png'});
          await cdp.detach();
        });
      }
      await page.close();
    }
    // Direct file:// navigation uses the same real CDN libraries and local assets.
    for(const name of ['index','about','product']){
      const page=await browser.newPage({viewport:{width:375,height:900}});
      page.on('pageerror',e=>report.errors.push({page:name,protocol:'file',type:'pageerror',message:e.message}));
      page.on('console',m=>{if(m.type()==='error')report.errors.push({page:name,protocol:'file',type:'console',message:m.text()});});
      page.on('requestfailed',r=>report.errors.push({page:name,protocol:'file',type:'requestfailed',url:r.url(),message:r.failure().errorText}));
      page.on('response',r=>{if(r.status()>=400)report.errors.push({page:name,protocol:'file',type:'http',url:r.url(),status:r.status()});});
      await page.goto(require('node:url').pathToFileURL(path.join(root,'html',name+'.html')).href,{waitUntil:'networkidle'});
      await check(name+': file:// load, images, menu and popup',async()=>{
        await page.evaluate(async()=>{for(const img of document.images)img.loading='eager'; await Promise.all(Array.from(document.images,img=>img.decode()));});
        assert.equal(await page.evaluate(()=>typeof Swal.fire),'function');
        await page.locator('#hamburger-btn').click(); assert.equal(await page.locator('#hamburger-btn').getAttribute('aria-expanded'),'true'); await page.keyboard.press('Escape');
        await page.locator('#newsletter-email').fill('test@example.com'); await page.locator('.newsletter button').click(); await page.locator('.swal2-icon-success').waitFor(); await dismiss(page);
        if(name==='index'){
          const before=await page.locator('#flash-countdown').textContent(); await page.waitForTimeout(1200); assert.notEqual(await page.locator('#flash-countdown').textContent(),before);
        }
        if(name==='product'){
          await page.locator('.thumbnail-item').nth(1).click(); await page.waitForTimeout(400); assert.match(await page.locator('#main-img').getAttribute('src'),/thumb-2.png$/);
          await page.locator('.color-thumb').nth(1).click(); assert.equal(await page.locator('.color-thumb').nth(1).getAttribute('aria-pressed'),'true');
          await page.locator('[data-quantity="increase"]').click(); assert.equal(await page.locator('#product-qty').inputValue(),'2');
          await page.locator('.btn-buy').click(); await page.locator('.swal2-icon-question').waitFor(); await page.locator('.swal2-cancel').click(); await page.waitForFunction(()=>!document.querySelector('.swal2-container'));
          await page.locator('#consult-name').fill('Nguyễn An'); await page.locator('#consult-phone').fill('0912345678'); await page.locator('#consult-form [type="submit"]').click(); await page.locator('.swal2-icon-success').waitFor(); await dismiss(page);
        }
        if(name!=='about'){
          const slider=page.locator('.swiper'); await slider.locator('.swiper-button-next').click(); await page.waitForTimeout(450); assert.ok(await slider.evaluate(el=>el.swiper.activeIndex>0));
        }
      });
      report.filePages.push({page:name,result:'pass'}); await page.close();
    }
    assert.deepEqual(report.errors,[]);
    report.status='passed';
    console.log(JSON.stringify({checks:report.checks.length,layouts:report.layouts.length,errors:report.errors},null,2));
  }catch(error){
    report.failure=error.stack;
    throw error;
  }finally{
    fs.writeFileSync('doc/acceptance-validation.json',JSON.stringify(report,null,2));
    await browser.close();server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});

