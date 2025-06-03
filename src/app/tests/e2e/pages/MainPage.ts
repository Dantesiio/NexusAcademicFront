import { By, until, WebDriver, WebElement } from 'selenium-webdriver';

export class MainPage {
  private driver: WebDriver;
  private baseUrl = 'http://localhost:3001';

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  /** Navega a http://localhost:3001/dashboard/main */
  async navigateToMain() {
    await this.driver.get(this.baseUrl + '/dashboard/main');
  }

  /** Hace clic en el botón de “Cerrar Sesión” (data-testid="logout-button") */
  async clickLogout() {
    const btn: WebElement = await this.driver.wait(
      until.elementLocated(By.css('[data-testid="logout-button"]')),
      5000,
      'No se encontró el botón de logout'
    );
    await btn.click();
  }

  /**
   * Espera hasta que la URL incluya '/auth/login' tras hacer logout.
   * Máximo de 10s.
   */
  async waitForLoginPage() {
    await this.driver.wait(
      async () => {
        const url = await this.driver.getCurrentUrl();
        return url.includes('/auth/login');
      },
      10000,
      'No se redirigió a /auth/login tras logout'
    );
  }
}