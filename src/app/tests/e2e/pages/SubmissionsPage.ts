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
      30000,
      'El grid de entregas no se cargó en 30s'
    );
  }

  /**
   * Obtiene el ID de la primera tarjeta de envío en el grid.
   */
  async getFirstSubmissionId(): Promise<string> {
    await this.waitForGrid();
    const firstCard = await this.driver.findElement(
      By.css('[data-testid="submissions-grid"] > div:first-child')
    );
    
    // Corregido: Primero obtener el atributo, luego aplicar replace
    const attributeValue = await firstCard.getAttribute('data-testid');
    return attributeValue.replace('submission-card-', '');
  }

  /**
   * Hace clic en el botón "Calificar" de una tarjeta específica por ID.
   * @param submissionId ID de la entrega (sin el prefijo 'submission-card-')
   */
  async clickCalificarForSubmission(submissionId: string) {
    const card = await this.driver.findElement(
      By.css(`[data-testid="submission-card-${submissionId}"]`)
    );
    
    const calificarBtn = await card.findElement(
      By.xpath('.//button[contains(text(), "Calificar")]')
    );
    
    // Desplazar y hacer clic con JavaScript
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});", 
      calificarBtn
    );
    await this.driver.executeScript(
      "arguments[0].click();", 
      calificarBtn
    );
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
    const modalElement = await this.driver.findElement(By.css('[data-testid="grading-modal"]'));
    await this.driver.wait(
      until.stalenessOf(modalElement),
      10000,
      'El modal de calificación no se cerró en 10s'
    );
  }
}