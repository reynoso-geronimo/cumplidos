"use server";
import puppeteer from "puppeteer";

const puppeteerBrowser = async ({ cuit, password }: { cuit: string; password: string }) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://auth.afip.gob.ar/contribuyente_/login.xhtml");
  await page.setViewport({ width: 1080, height: 1024 });

  await page.locator(".form-control").fill(cuit);
  await page.locator(".btn-info").click();
  await page.locator(".form-control").fill(password);
  await page.locator(".btn-info").click();

  await page.waitForSelector('a[href="/portal/app/mis-servicios"]');
  await page.click('a[href="/portal/app/mis-servicios"]');
  await page.locator("text/MOA – REINGENIERIA").click();

  await page.waitForNetworkIdle();
  const pages = await browser.pages();
  const page2 = pages[pages.length - 1];

  await page2.waitForNetworkIdle();

  // Find all select elements
  const selects = await page2.$$("select.typehead.autocompleto-select2");

  console.log("Found select elements:", selects.length);

  // Predefined values to select (adjust as needed)
  const values = ["20218735674", "DESP", "DESP"]; // Replace "ANOTHER_VALUE" with the correct option

  for (let i = 0; i < 3; i++) {
    const select = selects[i];

    // ✅ Wait for the select to be enabled
    await page2.waitForNetworkIdle();

    // ✅ Select the value (directly interacting with the select element)
    await select.select(values[i]);

    console.log(`Selected value: ${values[i]} in select ${i + 1}`);
  }
  await page2.waitForNetworkIdle();
  await page2.locator(".btn-ingresar").click();
  //await browser.close();
  await page2.waitForNavigation();
  await page2.goto(
    "https://serviciosadu.afip.gob.ar/DIAV2/Moa.Web/Moa.Destinaciones.Web/MoaDestinaciones/FiltroDestinaciones"
  );

  await page2.waitForNavigation();
};

export default puppeteerBrowser;
