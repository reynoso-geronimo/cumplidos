"use server";
import puppeteer from "puppeteer";

export const puppeteerCumplidos = async ({ cuit, password }: { cuit: string; password: string }) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://auth.afip.gob.ar/contribuyente_/login.xhtml");
  await page.setViewport({ width: 2080, height: 2024 });

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

  // Predefined values to select (adjust as needed)
  const values = ["20218735674", "DESP", "DESP"]; // Replace "ANOTHER_VALUE" with the correct option

  for (let i = 0; i < 3; i++) {
    const select = selects[i];

    // ✅ Wait for the select to be enabled
    await page2.waitForNetworkIdle();

    // ✅ Select the value (directly interacting with the select element)
    await select.select(values[i]);

    // console.log(`Selected value: ${values[i]} in select ${i + 1}`);
  }
  await page2.waitForNetworkIdle();
  await page2.locator(".btn-ingresar").click();
  //await browser.close();
  await page2.waitForNavigation();
  await page2.goto(
    "https://serviciosadu.afip.gob.ar/DIAV2/Moa.Web/Moa.Destinaciones.Web/MoaDestinaciones/FiltroDestinaciones"
  );

  //await page2.waitForNetworkIdle();
  try {
    //!!TODO FIX THIS
    await page2.waitForNetworkIdle({ timeout: 5000 });
  } catch (error) {
    console.error("Error waiting for network idle:", error);
  }

  //await page2.waitForSelector(".campo.campo-cuit-visible.form-control")
  await page2.locator(".campo.campo-cuit-visible.form-control").fill("30506730038");

  await page2.keyboard.press("Tab");
  await page2.waitForSelector("text/S A IMPORTADORA Y EXPORTADORA DE LA PATAGONIA");

  // await page2.locator(".btn.btn-primary.btn-buscar").click();

  await page2.locator("text/Buscar").click();

  await page2.waitForNavigation();

  //  await page2.locator("text/Estado").click();

  await page2.locator(".form-control.input-sm").fill("200");
  await page2.locator(".codigoEstadoDestinacion").click();

  const rows = await page2.$$("tr");

  const filteredRows = [];
  for (const row of rows) {
    const linkText = await row.$eval("a", el => el.innerText.trim()).catch(() => null);
    if (linkText === "AUTO") {
      const rowData = await row.evaluate(el => el.innerText.trim());
      filteredRows.push({ text: rowData });
    }
  }

  console.log(`Se encontraron ${filteredRows.length} filas con "AUTO"`);
  //await browser.close();

  return filteredRows;
};

export const puppeteerReintegros = async ({ cuit, password }: { cuit: string; password: string }) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://auth.afip.gob.ar/contribuyente_/login.xhtml");
  await page.setViewport({ width: 2080, height: 2024 });

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

  // Predefined values to select (adjust as needed)
  const values = ["20218735674", "DESP", "DESP"]; // Replace "ANOTHER_VALUE" with the correct option

  for (let i = 0; i < 3; i++) {
    const select = selects[i];

    // ✅ Wait for the select to be enabled
    await page2.waitForNetworkIdle();

    // ✅ Select the value (directly interacting with the select element)
    await select.select(values[i]);

    // console.log(`Selected value: ${values[i]} in select ${i + 1}`);
  }
  await page2.waitForNetworkIdle();
  await page2.locator(".btn-ingresar").click();
  //await browser.close();
  await page2.waitForNavigation();
  await page2.goto("https://serviciosadu.afip.gob.ar/DIAV2/MOA.Web/Moa.Beneficios.Web/MoaBeneficios/FiltroDeclas");

  //await page2.waitForNetworkIdle();
  try {
    //!!TODO FIX THIS
    await page2.waitForNetworkIdle({ timeout: 5000 });
  } catch (error) {
    console.error("Error waiting for network idle:", error);
  }

  //await page2.waitForSelector(".campo.campo-cuit-visible.form-control")
  await page2.locator(".campo.campo-cuit-visible.form-control").fill("30531413586");

  await page2.keyboard.press("Tab");
  await page2.waitForSelector("text/METRIVE SA");

  try {
    //!!TODO FIX THIS
    await page2.waitForNetworkIdle({ timeout: 5000 });
  } catch (error) {
    console.error("Error waiting for network idle:", error);
  }

  await page.evaluate(() => {
  const select = document.querySelector('select[name="aduana"]');
  if (select) {
    select.value = "060"; // Set the select value to "060-SAN PEDRO"
    select.dispatchEvent(new Event("change", { bubbles: true })); // Notify Select2
  }
});
  // await page2.locator(".btn.btn-primary.btn-buscar").click();

 // await page2.locator("text/Buscar").click();

  await page2.waitForNavigation();

  //  await page2.locator("text/Estado").click();

  await page2.locator(".form-control.input-sm").fill("200");
  await page2.locator(".codigoEstadoDestinacion").click();

  const rows = await page2.$$("tr");

  const filteredRows = [];
  for (const row of rows) {
    const linkText = await row.$eval("a", el => el.innerText.trim()).catch(() => null);
    if (linkText === "AUTO") {
      const rowData = await row.evaluate(el => el.innerText.trim());
      filteredRows.push({ text: rowData });
    }
  }

  console.log(`Se encontraron ${filteredRows.length} filas con "AUTO"`);
  //await browser.close();

  return filteredRows;
};
