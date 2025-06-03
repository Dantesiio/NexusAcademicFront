// tests/e2e/tests/courses.test.ts
import { Builder } from 'selenium-webdriver';
import { CoursesPage } from '../pages/CoursesPage';
import { LoginPage } from '../pages/LoginPage';
import chrome from 'selenium-webdriver/chrome';

describe('Courses Management Tests', () => {
  let driver: any;
  let coursesPage: CoursesPage;
  let loginPage: LoginPage;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();
    
    loginPage = new LoginPage(driver);
    coursesPage = new CoursesPage(driver);
    
    // Login first
    await loginPage.navigateToLogin();
    await loginPage.enterCredentials('admin@nexus.edu', 'admin123');
    await loginPage.submitLogin();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should display courses list', async () => {
    await coursesPage.navigateToCourses();
    const count = await coursesPage.getCourseCount();
    expect(count).toBeGreaterThan(0);
  });

  it('should add a new course', async () => {
    await coursesPage.navigateToCourses();
    const initialCount = await coursesPage.getCourseCount();
    
    await coursesPage.clickAddCourse();
    await coursesPage.fillCourseForm({
      name: 'Nuevo Curso Selenium',
      code: 'SEL-101',
      description: 'Curso de pruebas automatizadas',
      startDate: '2023-01-01',
      endDate: '2023-06-30'
    });
    await coursesPage.submitCourseForm();
    
    await driver.wait(until.urlContains('/courses'), 5000);
    const newCount = await coursesPage.getCourseCount();
    expect(newCount).toBe(initialCount + 1);
  });

  it('should filter courses by search term', async () => {
    await coursesPage.navigateToCourses();
    await coursesPage.searchCourse('Selenium');
    
    const filteredCount = await coursesPage.getCourseCount();
    expect(filteredCount).toBe(1);
  });
});