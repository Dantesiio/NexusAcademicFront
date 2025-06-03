// tests/e2e/pages/LoginPage.ts
import { Builder, By, until, WebDriver } from 'selenium-webdriver';

export class LoginPage {
  private driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async navigateToLogin() {
    await this.driver.get('http://localhost:3000/auth/login');
  }

  async enterCredentials(email: string, password: string) {
    await this.driver.findElement(By.id('email')).sendKeys(email);
    await this.driver.findElement(By.id('password')).sendKeys(password);
  }

  async submitLogin() {
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async getErrorMessage() {
    const errorElement = await this.driver.wait(
      until.elementLocated(By.css('.error-message')),
      5000
    );
    return errorElement.getText();
  }

  async isDashboardVisible() {
    try {
      await this.driver.wait(
        until.elementLocated(By.id('dashboard-header')),
        5000
      );
      return true;
    } catch {
      return false;
    }
  }
}