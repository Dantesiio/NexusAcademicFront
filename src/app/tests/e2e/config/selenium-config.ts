// tests/e2e/config/selenium-config.ts

import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';

/**
 * buildDriver(): instancia un WebDriver de Chrome
 * usando el binario que provee el paquete chromedriver.
 */
export async function buildDriver(): Promise<ThenableWebDriver> {
  // 1) Indicarle a Selenium dónde está el chromedriver
  const service = new chrome.ServiceBuilder(chromedriver.path).build();

  // 2) Opciones de Chrome
  const options = new chrome.Options();
  // Si no quieres ver la ventana de Chrome, descomenta:
  // options.addArguments('--headless');

  // 3) Construir el driver apuntando a Chrome
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  return driver;
}