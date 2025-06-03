import { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';

declare const driver: WebDriver;

describe('Logout Test', () => {
  let loginPage: LoginPage;
  let mainPage: MainPage;

  beforeAll(() => {
    loginPage = new LoginPage(global.driver);
    mainPage = new MainPage(global.driver);
  }, 30000);

  it(
    'debe hacer logout y redirigir a la página de login',
    async () => {
      console.log('Starting logout test…');

      // 1) Hacer login como admin
      await loginPage.navigateToLogin();
      console.log('Navigated to login page');

      await loginPage.enterCredentials('admin@nexus.com', 'Admin123');
      console.log('Admin credentials entered');

      await loginPage.submitLogin();
      console.log('Admin login submitted');

      // 2) Esperar a que la URL incluya '/dashboard'
      await driver.wait(
        async () => (await driver.getCurrentUrl()).includes('/dashboard'),
        30000,
        'No se redirigió a /dashboard tras login'
      );
      console.log('Admin successfully logged in, current URL:', await driver.getCurrentUrl());

      // 3) Navegar a Main (en caso de que el login no redirija directo a /dashboard/main)
      await mainPage.navigateToMain();
      console.log('Navigated to main page');

      // 4) Hacer clic en “Cerrar Sesión”
      await mainPage.clickLogout();
      console.log('Clicked logout button');

      // 5) Esperar a que redirija a /auth/login
      await mainPage.waitForLoginPage();
      console.log('Redirected to login page after logout:', await driver.getCurrentUrl());

      // 6) Verificar que haya vuelto a la URL de login
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toMatch(/\/auth\/login/);
      console.log('Logout test completed successfully');
    },
    60000 // 1 minuto timeout
  );
});