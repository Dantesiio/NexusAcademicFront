import { By, until, WebDriver } from 'selenium-webdriver';

export class DashboardPage {
  private driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  /** Hace logout desde el dashboard */
  async logout() {
    // Abrir el menú de usuario
    const userMenu = await this.driver.wait(
      until.elementLocated(By.css('[data-testid="user-menu"]')),
      10000
    );
    await userMenu.click();

    // Esperar a que el menú se expanda
    await this.driver.sleep(500);

    // Hacer clic en el botón de logout
    const logoutButton = await this.driver.wait(
      until.elementIsVisible(
        this.driver.findElement(By.css('[data-testid="logout-button"]'))
      ),
      5000
    );
    await logoutButton.click();
  }
}   