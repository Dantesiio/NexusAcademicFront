import { By, until, WebDriver, WebElement } from 'selenium-webdriver';

export class StudentPage {
  private driver: WebDriver;
  private baseUrl = 'http://localhost:3001';

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  /** Navega a http://localhost:3001/dashboard/students */
  async navigateToStudents() {
    await this.driver.get(this.baseUrl + '/dashboard/students');
  }

  /** Hace clic en el botón “Nuevo Estudiante” */
  async clickNewStudentButton() {
    // Buscamos el botón que contiene el texto “Nuevo Estudiante”
    // Ajusta el selector si tu botón difiere de texto o clases
    const btn: WebElement = await this.driver.wait(
      until.elementLocated(By.xpath(`//button[contains(text(), 'Nuevo Estudiante')]`)),
      5000
    );
    await btn.click();
  }

  /** Ingresa el nombre en input#name */
  async enterName(name: string) {
    const input: WebElement = await this.driver.wait(
      until.elementLocated(By.id('name')),
      5000
    );
    await input.clear();
    await input.sendKeys(name);
  }

  /** Ingresa la edad en input#age */
  async enterAge(age: string) {
    const input: WebElement = await this.driver.findElement(By.id('age'));
    await input.clear();
    await input.sendKeys(age);
  }

  /** Ingresa el email en input#email */
  async enterEmail(email: string) {
    const input: WebElement = await this.driver.findElement(By.id('email'));
    await input.clear();
    await input.sendKeys(email);
  }

  /** Selecciona género en select#gender */
  async selectGender(gender: 'Male' | 'Female' | 'Other') {
    const select: WebElement = await this.driver.findElement(By.id('gender'));
    await select.sendKeys(gender);
  }

  /** Ingresa nickname en input#nickname */
  async enterNickname(nickname: string) {
    const input: WebElement = await this.driver.findElement(By.id('nickname'));
    await input.clear();
    await input.sendKeys(nickname);
  }

  /** Envía el formulario (botón type="submit" dentro de StudentForm) */
  async submitForm() {
    const btn: WebElement = await this.driver.findElement(By.css('form[data-testid="student-form"] button[type="submit"]'));
    await btn.click();
  }

  /**
   * Espera hasta que la tabla de estudiantes contenga una celda <td> con el email dado.
   * Tabla: <table class="min-w-full ..."> en StudentTable.
   */
  async waitForStudentInTable(email: string) {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//table[contains(@class,'min-w-full')]//td[text()="${email}"]`)),
      10000,
      `No se encontró el estudiante con email "${email}" en la tabla`
    );
  }
}