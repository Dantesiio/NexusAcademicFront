// tests/e2e/tests/login.test.ts
import { Builder, By, until } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import chrome from 'selenium-webdriver/chrome';

describe('Login Tests', () => {
  let driver: any;
  let loginPage: LoginPage;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();
    loginPage = new LoginPage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should login successfully with valid credentials', async () => {
    await loginPage.navigateToLogin();
    await loginPage.enterCredentials('profesor@nexus.edu', 'password123');
    await loginPage.submitLogin();
    
    const isDashboardVisible = await loginPage.isDashboardVisible();
    expect(isDashboardVisible).toBeTruthy();
  });

  it('should show error with invalid credentials', async () => {
    await loginPage.navigateToLogin();
    await loginPage.enterCredentials('wrong@email.com', 'wrongpass');
    await loginPage.submitLogin();
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Credenciales inválidas');
  });
});