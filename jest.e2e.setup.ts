// src/app/tests/e2e/config/jest.e2e.setup.ts

import { Builder } from 'selenium-webdriver';
import { ServiceBuilder, Options } from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';

let driver: any;

beforeAll(async () => {
  try {
    console.log('Starting ChromeDriver setup…');

    // 1) Crear el ServiceBuilder apuntando AL binario de chromedriver instalado por npm
    const service = new ServiceBuilder(chromedriver.path);

    // 2) Configurar las opciones de Chrome (headless, tamaño de ventana, etc.)
    const options = new Options();
    options.addArguments(
      '--headless=new',        // modo headless (sin GUI)
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080',
      '--disable-gpu'
    );

    console.log('Building WebDriver instance…');

    // 3) Construir el WebDriver usando explícitamente EL service y LAS options
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    console.log('WebDriver instance created, setting timeouts…');

    await driver.manage().setTimeouts({
      implicit: 15000,   // milisegundos de espera implícita
      pageLoad: 40000,   // milisegundos para carga de página
      script: 30000,     // milisegundos para ejecución de script
    });

    // 4) Exponer driver como global para que los tests accedan a global.driver
    (global as any).driver = driver;
    console.log('WebDriver setup completed successfully');
  } catch (error) {
    console.error('Error during WebDriver setup:', error);
    throw error;
  }
}, 120000); // timeout de 120s para este hook

afterAll(async () => {
  if (driver) {
    console.log('Quitting WebDriver…');
    await driver.quit();
  }
}, 30000);