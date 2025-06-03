// tests/e2e/pages/CoursesPage.ts
import { Builder, By, until, WebDriver } from 'selenium-webdriver';

export class CoursesPage {
  private driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async navigateToCourses() {
    await this.driver.get('http://localhost:3000/dashboard/courses');
  }

  async clickAddCourse() {
    await this.driver.findElement(By.xpath('//button[contains(., "Nuevo Curso")]')).click();
  }

  async fillCourseForm(data: {
    name: string;
    code: string;
    description: string;
    startDate: string;
    endDate: string;
  }) {
    await this.driver.findElement(By.id('course-name')).sendKeys(data.name);
    await this.driver.findElement(By.id('course-code')).sendKeys(data.code);
    await this.driver.findElement(By.id('course-description')).sendKeys(data.description);
    await this.driver.findElement(By.id('start-date')).sendKeys(data.startDate);
    await this.driver.findElement(By.id('end-date')).sendKeys(data.endDate);
  }

  async submitCourseForm() {
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async searchCourse(term: string) {
    const searchInput = await this.driver.findElement(By.css('input[placeholder="Buscar cursos..."]'));
    await searchInput.clear();
    await searchInput.sendKeys(term);
  }

  async getCourseCount(): Promise<number> {
    const elements = await this.driver.findElements(By.css('.course-row'));
    return elements.length;
  }
}