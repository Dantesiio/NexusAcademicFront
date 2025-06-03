import { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { StudentPage } from '../pages/StudentPage';

declare const driver: WebDriver;

describe('Student Enrollment Test (como admin)', () => {
  let loginPage: LoginPage;
  let studentPage: StudentPage;

  beforeAll(() => {
    loginPage = new LoginPage(global.driver);
    studentPage = new StudentPage(global.driver);
  }, 30000);

  it(
    'debe crear un nuevo estudiante y agregarle una matrícula',
    async () => {
      console.log('Starting student + enrollment test as admin…');

      // 1) Hacer login como admin
      await loginPage.navigateToLogin();
      console.log('Navigated to login page');

      await loginPage.enterCredentials('admin@nexus.com', 'Admin123');
      console.log('Admin credentials entered');

      await loginPage.submitLogin();
      console.log('Admin login submitted');

      // 2) Esperar a que la URL incluya '/dashboard'
      await driver.wait(
        async () => (await driver.getCurrentUrl()).includes('/dashboard'),
        30000,
        'No se redirigió a /dashboard tras login'
      );
      console.log('Admin successfully logged in, current URL:', await driver.getCurrentUrl());

      // 3) Navegar a la página de estudiantes
      await studentPage.navigateToStudents();
      console.log('Navigated to students page');

      // 4) Hacer clic en “Nuevo Estudiante”
      await studentPage.clickNewStudentButton();
      console.log('Clicked "Nuevo Estudiante" button');

      // 5) Llenar los datos básicos del estudiante
      const timestamp = Date.now();
      const testEmail = `estudiante${timestamp}@school.com`;

      await studentPage.enterName('Estudiante Para Matrícula');
      console.log('Name entered');

      await studentPage.enterAge('22');
      console.log('Age entered');

      await studentPage.enterEmail(testEmail);
      console.log('Email entered:', testEmail);

      await studentPage.selectGender('Female');
      console.log('Gender selected: Female');

      await studentPage.enterNickname('nickmatricula');
      console.log('Nickname entered: nickmatricula');

      // 6) Agregar una matrícula
      await studentPage.clickAddEnrollment();
      console.log('Clicked "Agregar Matrícula"');

      // 7) En el primer bloque (index=0), seleccionar el primer curso disponible
      await studentPage.selectCourseForEnrollment(0);
      console.log('Course selected for enrollment');

      // 8) Ingresar fecha de matriculación (hoy en formato YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0]; // p. ej. "2025-06-02"
      await studentPage.enterEnrollmentDate(0, today);
      console.log('Enrollment date entered:', today);

      // 9) Ingresar puntuación inicial (opcional; ponemos "0" para “sin calificar”)
      await studentPage.enterEnrollmentScore(0, '0');
      console.log('Enrollment score entered: 0');

      // 10) Enviar el formulario completo
      await studentPage.submitForm();
      console.log('Student form submitted');

      // 11) Esperar a que el estudiante aparezca en la tabla
      await studentPage.waitForStudentInTable(testEmail);
      console.log('New student found in table:', testEmail);

      // 12) Verificar que la columna de matrículas muestre “1”
      const enrollCount = await studentPage.getEnrollmentCountForStudent(testEmail);
      console.log(`Enrollment count for ${testEmail}:`, enrollCount);
      expect(enrollCount).toBe(1);

      console.log('Student + enrollment test completed successfully');
    },
    120000 // 2 minutos timeout para este test
  );
});