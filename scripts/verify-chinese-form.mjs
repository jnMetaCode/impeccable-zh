#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const built = path.join(root, 'demos/chinese-form/dist');
const output = path.join(root, 'build/chinese-form-evidence');
assert.ok(fs.existsSync(path.join(built, 'index.html')), 'Build the demo first: npm --prefix demos/chinese-form run build');
fs.mkdirSync(output, { recursive: true });
const reportPath = path.join(output, 'report.json');
fs.rmSync(reportPath, { force: true });

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const target = path.resolve(built, relative);
  if (!target.startsWith(`${built}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'content-type': mime[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
});

let browser;
const checks = [];
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHINESE_FORM_BROWSER ? { executablePath: process.env.CHINESE_FORM_BROWSER } : {}),
  });
  for (const width of [320, 360, 640, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));
    for (const version of ['before', 'after']) {
      await page.goto(version === 'before' ? `${url}/?view=before` : url);
      await page.locator('.el-form').waitFor();
      await page.screenshot({ path: path.join(output, `${version}-${width}.png`), fullPage: true });
      if (version === 'after') {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
        const dimensions = await page.locator('.customer-form .el-input__wrapper, .actions .el-button').evaluateAll((elements) => elements.map((element) => {
          const { width, height } = element.getBoundingClientRect();
          return { width, height };
        }));
        assert.ok(dimensions.length >= 4);
        assert.ok(dimensions.every((item) => item.width >= 44 && item.height >= 44));
        await page.getByRole('button', { name: '保存客户资料', exact: true }).click();
        await page.getByText('请输入企业统一社会信用代码。', { exact: true }).waitFor();
        await page.getByText('请选择合同生效日期。', { exact: true }).waitFor();
        await page.locator('#credit-code').fill('91350211M000100Y43');
        await page.locator('#start-date').click();
        const panel = page.locator('.demo-date-popover .el-date-picker');
        await panel.waitFor({ state: 'visible' });
        assert.match(await panel.innerText(), /年/);
        const bounds = await panel.boundingBox();
        assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 1, `Date panel outside ${width}px viewport`);
        await panel.locator('td.available:not(.prev-month):not(.next-month)').first().click();
        await page.locator('#start-date').blur();
        await page.locator('.failure-control input').check();
        await page.getByRole('button', { name: '保存客户资料', exact: true }).click();
        await page.getByText('正在保存客户资料', { exact: true }).waitFor();
        assert.equal(await page.locator('#credit-code').isDisabled(), true);
        await page.getByRole('status').filter({ hasText: '本次模拟保存失败' }).waitFor();
        assert.equal(await page.locator('#credit-code').inputValue(), '91350211M000100Y43');
        await page.getByRole('button', { name: '保存客户资料', exact: true }).click();
        await page.getByRole('status').filter({ hasText: '演示保存完成' }).waitFor();
        checks.push({ width, layout: 'pass', dateLocale: 'pass', validation: 'pass', retry: 'pass' });
      }
      if (version === 'after') {
        await page.screenshot({ path: path.join(output, `after-saved-${width}.png`), fullPage: true });
        await page.getByRole('button', { name: '清空输入', exact: true }).click();
        assert.equal(await page.locator('#credit-code').inputValue(), '');
        assert.equal(await page.locator('#start-date').inputValue(), '');
      }
    }
    assert.deepEqual(pageErrors, []);
    await page.close();
  }
  fs.writeFileSync(reportPath, JSON.stringify({
    status: 'pass', browser: browser.version(), timestamp: new Date().toISOString(),
    implementation: 'AI-assisted reference implementation; not a model efficacy evaluation',
    checks,
    untested: ['real touch devices', 'browser 200% zoom', 'screen readers', 'complete keyboard navigation'],
  }, null, 2) + '\n');
  console.log(`Browser checks passed; evidence: ${output}`);
} finally {
  if (browser) await browser.close();
  if (server.listening) await new Promise((resolve) => server.close(resolve));
}
