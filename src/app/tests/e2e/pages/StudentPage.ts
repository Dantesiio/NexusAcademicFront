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
    const btn: WebElement = await this.driver.wait(
      until.elementLocated(By.xpath(`//button[contains(text(), 'Nuevo Estudiante')]`)),
      5000,
      'No se encontró el botón “Nuevo Estudiante”'
    );
    await btn.click();
  }

  /** Ingresa el nombre en input#name */
  async enterName(name: string) {
    const input: WebElement = await this.driver.wait(
      until.elementLocated(By.id('name')),
      5000,
      'No se encontró input#name'
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

  /** Hace clic en el botón “Agregar Matrícula” dentro de StudentForm */
  async clickAddEnrollment() {
    const btn: WebElement = await this.driver.findElement(
      By.xpath(`//button[contains(text(), 'Agregar Matrícula')]`)
    );
    await btn.click();
  }

  /**
   * Una vez hecha click en “Agregar Matrícula”, espera a que aparezca
   * el primer bloque de matrícula y lo devuelve.
   */
  private async waitForEnrollmentBlock(index: number): Promise<WebElement> {
    // Esperar a que haya al menos (index+1) bloques de matrícula:
    return await this.driver.wait(
      async () => {
        const blocks = await this.driver.findElements(
          By.css('div.mt-2.p-3.border.rounded-md.bg-black-50')
        );
        return blocks.length > index ? blocks[index] : null;
      },
      5000,
      `No se creó el bloque de matrícula #${index} en 5s`
    );
  }

  /**
   * Selecciona el curso en el bloque de matrícula index (0-based).
   * Si no recibe courseName, escoge la segunda opción (primer curso disponible).
   */
  async selectCourseForEnrollment(index: number, courseName?: string) {
    const block = await this.waitForEnrollmentBlock(index);
    const select: WebElement = await block.findElement(By.css('select'));
    if (courseName) {
      await select.sendKeys(courseName);
    } else {
      // Elegir la primera opción diferente del placeholder
      const options = await select.findElements(By.tagName('option'));
      for (const opt of options) {
        const val = await opt.getAttribute('value');
        if (val && val.trim() !== '') {
          await select.sendKeys(await opt.getText());
          break;
        }
      }
    }
  }

  /**
   * Ingresa la fecha en el bloque de matrícula index (0-based).
   * Usa input[type="date"].
   */
  async enterEnrollmentDate(index: number, dateISO: string) {
    const block = await this.waitForEnrollmentBlock(index);
    const dateInput: WebElement = await block.findElement(By.css('input[type="date"]'));
    await dateInput.clear();
    await dateInput.sendKeys(dateISO);
  }

  /**
   * Ingresa la puntuación en el bloque de matrícula index (0-based).
   * Usa input[type="number"] dentro del bloque.
   */
  async enterEnrollmentScore(index: number, score: string) {
    const block = await this.waitForEnrollmentBlock(index);
    const numberInput: WebElement = await block.findElement(
      By.xpath(`.//input[@type="number" and not(@id)]`)); // ignora id="age");
    await numberInput.clear();
    await numberInput.sendKeys(score);
  }

  /** Envía el formulario de StudentForm (button[type="submit"]) */
  async submitForm() {
    const btn: WebElement = await this.driver.findElement(
      By.css('form[data-testid="student-form"] button[type="submit"]')
    );
    await btn.click();
  }

  /**
   * Espera hasta que la tabla de estudiantes contenga una celda <td> con el email dado.
   */
  async waitForStudentInTable(email: string) {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//table[contains(@class,'min-w-full')]//td[text()="${email}"]`)),
      10000,
      `No se encontró el estudiante con email "${email}" en la tabla`
    );
  }

  /**
   * Devuelve el número de matrículas mostradas en la tabla para ese email.
   * Asume que la columna de matrículas es la sexta (<td> en índice 5) en la misma fila del email.
   */
  async getEnrollmentCountForStudent(email: string): Promise<number> {
    // Encuentra la fila que contiene el email
    const cell = await this.driver.findElement(
      By.xpath(`//table[contains(@class,'min-w-full')]//td[text()="${email}"]`)
    );
    // Subir a la fila <tr>
    const row = await cell.findElement(By.xpath('ancestor::tr'));
    // Obtener la sexta celda (índice 5)
    const tds = await row.findElements(By.tagName('td'));
    const enrollCountText = await tds[5].getText();
    return parseInt(enrollCountText, 10);
  }
}