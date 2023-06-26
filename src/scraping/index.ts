import puppeteer from 'puppeteer';
import { Feed } from '../feed/schemas/feed.schema';

export async function getDataELPAIS(url: string, newspaper: string) {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    const articles = [
      ...document.querySelectorAll('article.c.c-d.c--m'),
      ...document.querySelectorAll('article.c.c-d.c--m-n'),
    ].slice(0, 5);
    const resultData = articles.map((x) => {
      const documentArticle = x.querySelector('h2 a');
      const title =
        (documentArticle as HTMLElement).innerText ?? 'Importan new';
      // @ts-ignore
      const url = documentArticle.href;
      return { title, url };
    });
    return resultData;
  });
  await browser.close();

  // go to the second page to get one new
  const articles = await data.map(async (y) => {
    const title = y.title;
    const originalUrl = y.url;
    const auxBrowser = await puppeteer.launch({
      headless: false,
      slowMo: 200,
    });
    const auxPage = await auxBrowser.newPage();
    await auxPage.goto(y.url);

    const auxData = await auxPage.evaluate(() => {
      const subtitle =
        (document.querySelector('h2.a_st') as HTMLElement).innerText ?? '-';
      const context =
        (document.querySelectorAll('article div p')[1] as HTMLElement)
          .innerText ?? '-';
      return { subtitle, context };
    });

    const finalResult: Feed = {
      title,
      context: auxData.context,
      subtitle: auxData.subtitle,
      originalUrl,
      newspaper,
    };

    await auxBrowser.close();
    return finalResult;
  });

  return await Promise.all(articles);
}

export async function getDataELMUNDO(url: string, newspaper: string) {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    const articles = [
      ...document.querySelectorAll('div.ue-l-cg__unit>article'),
    ].slice(0, 5);

    const resultData = articles.map((x) => {
      const urlDocument = x.querySelector('a');
      const titleDocument = x.querySelector('h2');
      const url = urlDocument.href;
      const title = titleDocument.innerText;

      return { title, url };
    });
    return resultData;
  });
  await browser.close();

  // go to the second page to get one new
  const articles = await data.map(async (y) => {
    const title = y.title;
    const originalUrl = y.url;
    const auxBrowser = await puppeteer.launch({
      headless: false,
      slowMo: 200,
    });
    const auxPage = await auxBrowser.newPage();
    await auxPage.goto(y.url);

    const auxData = await auxPage.evaluate(() => {
      const subtitle =
        (document.querySelector('p.ue-c-article__standfirst') as HTMLElement).innerText ?? '-';
      const context =
        (document.querySelector('div.ue-l-article__body p') as HTMLElement)
          .innerText ?? '-';
      return { subtitle, context };
    });

    const finalResult: Feed = {
      title,
      context: auxData.context,
      subtitle: auxData.subtitle,
      originalUrl,
      newspaper,
    };

    await auxBrowser.close();
    return finalResult;
  });

  return await Promise.all(articles);
}
