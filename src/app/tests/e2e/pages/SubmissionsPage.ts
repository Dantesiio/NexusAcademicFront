import { By, until, WebDriver, WebElement } from 'selenium-webdriver';

export class SubmissionsPage {
  private driver: WebDriver;
  private baseUrl = 'http://localhost:3001';

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  /** Navega a http://localhost:3001/dashboard/submissions */
  async navigateToSubmissions() {
    await this.driver.get(this.baseUrl + '/dashboard/submissions');
  }

  /**
   * Espera hasta que se cargue el grid de entregas
   * (contenedor con data-testid="submissions-grid").
   */
  async waitForGrid() {
    await this.driver.wait(
      until.elementLocated(By.css('[data-testid="submissions-grid"]')),
      10000,
      'El grid de entregas no se cargó en 10s'
    );
  }

  /**
   * Encuentra la primera carta de envío que esté “Pendiente”
   * (span con texto “Pendiente”), y hace clic en su botón “Calificar”.
   */
  async clickFirstCalificar() {
    // 1) Encontrar el contenedor de la primera entrega pendiente
    const pendingCard: WebElement = await this.driver.wait(
      until.elementLocated(
        By.xpath(`
          //div[@data-testid="submissions-grid"]//span[text()="Pendiente"]/ancestor::div[contains(@class,"shadow")]`
        )
      ),
      10000,
      'No se encontró ninguna entrega con estado “Pendiente”'
    );

    // 2) Dentro de esa card, buscar el botón que contiene el texto “Calificar”
    const calificarBtn = await pendingCard.findElement(
      By.xpath(`.//button[contains(text(), "Calificar")]`)
    );
    await calificarBtn.click();
  }

  /**
   * En el modal de calificación (data-testid="grading-modal"), ingresa la calificación.
   * @param grade Valor numérico como string, p.ej. "4.5"
   */
  async enterGrade(grade: string) {
    const gradeInput = await this.driver.wait(
      until.elementLocated(By.id('submissionGrade')),
      5000,
      'No se encontró el input de calificación (id="submissionGrade")'
    );
    await gradeInput.clear();
    await gradeInput.sendKeys(grade);
  }

  /**
   * En el modal de calificación, ingresa los comentarios.
   * @param comments Texto que pondrás en el textarea.
   */
  async enterComments(comments: string) {
    const commentsInput = await this.driver.findElement(By.id('submissionComments'));
    await commentsInput.clear();
    await commentsInput.sendKeys(comments);
  }

  /**
   * En el modal de calificación, hace clic en el botón “Calificar” que está dentro del modal.
   */
  async submitGrade() {
    const submitBtn = await this.driver.findElement(
      By.xpath(`//div[@data-testid="grading-modal"]//button[contains(text(), "Calificar")]`)
    );
    await submitBtn.click();
  }

  /**
   * Espera a que desaparezca el modal de calificación (data-testid="grading-modal").
   */
  async waitForModalToClose() {
    await this.driver.wait(
      until.stalenessOf(await this.driver.findElement(By.css('[data-testid="grading-modal"]'))),
      10000,
      'El modal de calificación no se cerró en 10s'
    );
  }

  /**
   * Espera hasta que la misma carta que estaba pendiente muestre ahora la calificación numeric/5.0.
   * @param grade El número (como string) que esperas ver, p.ej. "4.5"
   */
  async waitForGradeOnFirstCard(grade: string) {
    // Buscamos la primera card que contenga el texto “grade/5.0”
    await this.driver.wait(
      until.elementLocated(
        By.xpath(`
          //div[@data-testid="submissions-grid"]//span[text()="${grade}/5.0"]`
        )
      ),
      10000,
      `No se encontró la calificación “${grade}/5.0” en 10s`
    );
  }
}