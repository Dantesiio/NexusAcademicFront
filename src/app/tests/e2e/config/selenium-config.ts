// tests/e2e/config/selenium-config.ts
import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

/**
 * buildDriver(): instancia un WebDriver de Chrome
 * usando el binario que provee el paquete chromedriver.
 */
export async function buildDriver(): Promise<ThenableWebDriver> {
  // 1) Obtener la ruta del chromedriver
  const chromedriverPath = path.resolve(
    __dirname, 
    '../../../..', 
    'node_modules', 
    'chromedriver', 
    'bin', 
    'chromedriver'
  );

  // 2) Crear el service builder con la ruta correcta
  const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);

  // 3) Opciones de Chrome
  const options = new chrome.Options();
  // Configuraciones recomendadas para ejecución en CI
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  // Si no quieres ver la ventana de Chrome, descomenta:
  // options.addArguments('--headless=new'); // Usar el nuevo headless

  // 4) Construir el driver usando ServiceBuilder
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

  return driver;
}