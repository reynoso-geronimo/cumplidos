"use server";
import puppeteer from "puppeteer";
// Or import puppeteer from 'puppeteer-core';

const puppeteerBrowser = async ({ cuit, password }: { cuit: string; password: string }) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://auth.afip.gob.ar/contribuyente_/login.xhtml");

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box.
  await page.locator(".form-control").fill(cuit);
  await page.locator(".btn-info").click();
  await page.locator(".form-control").fill(password);
  await page.locator(".btn-info").click();
  // Wait and click on first result.
  await page.waitForSelector('a[href="/portal/app/mis-servicios"]');
  await page.click('a[href="/portal/app/mis-servicios"]');
  await page.locator("text/MOA – REINGENIERIA").click();

  //get list of open tabs (does not include new tab)
  await page.waitForNetworkIdle();
  const pages = await browser.pages();

  //prints 2 although there are 3 tabs
  console.log(pages.length);
  console.log(pages);
  // get the new page
  const page2 = pages[pages.length - 1];

  await page2.waitForNetworkIdle();

  await page2.select("select.typehead.autocompleto-select2:nth-of-type(1)", "20218735674");
  
  await page2.select("select.typehead.autocompleto-select2:nth-of-type(2)", "DESP");

  //await browser.close();
  // Locate the full title with a unique string.
  const textSelector = await page.locator("text/Customize and automate").waitHandle();
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title.
  console.log('The title of this blog post is "%s".', fullTitle);
};
export default puppeteerBrowser;
