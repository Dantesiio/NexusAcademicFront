// src/app/tests/e2e/tests/login.test.ts

import { LoginPage } from '../pages/LoginPage';
import { WebDriver } from 'selenium-webdriver';

declare const driver: WebDriver;

describe('Login Tests', () => {
  let loginPage: LoginPage;

  beforeAll(() => {
    loginPage = new LoginPage(global.driver);
  }, 30000);

  it(
    'should login with valid credentials',
    async () => {
      console.log('Starting login test...');

      // 1) Navegar a la página de login
      await loginPage.navigateToLogin();
      console.log('Navigated to login page');

      // 2) Ingresar email y password válidos
      await loginPage.enterCredentials('admin@nexus.com', 'Admin123');
      console.log('Credentials entered');

      // 3) Enviar el formulario de login
      await loginPage.submitLogin();
      console.log('Login submitted');

      // 4) Esperar a que la URL incluya '/dashboard' (en vez de '/dashboard/main')
      //    porque tu aplicación podría redirigir simplemente a /dashboard
      await driver.wait(
        async () => {
          const url = await driver.getCurrentUrl();
          return url.includes('/dashboard/main');
        },
        30000,
        'La URL no cambió a /dashboard en 30s'
      );

      const currentUrl = await driver.getCurrentUrl();
      console.log('Current URL after login:', currentUrl);
      expect(currentUrl).toMatch(/\/dashboard(\/main)?/);

      console.log('Login test completed successfully');
    },
    60000 // 1 minuto timeout para este test
  );
});