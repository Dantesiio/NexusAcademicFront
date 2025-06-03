import { By, until, WebDriver } from 'selenium-webdriver';

export class LoginPage {
  private driver: WebDriver;
  private baseUrl = 'http://localhost:3001';

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  /** Navega a http://localhost:3001/auth/login */
  async navigateToLogin() {
    await this.driver.get(this.baseUrl + '/auth/login');
  }

  /** Ingresa email y password en los inputs con id="email" y id="password" */
  async enterCredentials(email: string, password: string) {
    const emailInput = await this.driver.findElement(By.id('email'));
    await emailInput.clear();
    await emailInput.sendKeys(email);

    const passwordInput = await this.driver.findElement(By.id('password'));
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  /** Hace clic en el botón submit (button[type="submit"]) */
  async submitLogin() {
    const submitBtn = await this.driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
  }

  /** Devuelve el texto del mensaje de error si aparece */
  async getErrorMessage(): Promise<string> {
    const errorElement = await this.driver.wait(
      until.elementLocated(By.css('.error-message')),
      5000
    );
    return errorElement.getText();
  }

  /**
   * Espera hasta 5s a que exista un elemento con id="dashboard-header",
   * que asumimos es un <h1 id="dashboard-header">Dashboard</h1> o similar.
   * Si lo encuentra, devuelve true; si se agota el timeout, devuelve false.
   */
  async isDashboardVisible(): Promise<boolean> {
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