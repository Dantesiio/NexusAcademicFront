import { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { StudentPage } from '../pages/StudentPage';

declare const driver: WebDriver;

describe('Student Registration Tests (como admin)', () => {
  let loginPage: LoginPage;
  let studentPage: StudentPage;

  beforeAll(() => {
    loginPage = new LoginPage(global.driver);
    studentPage = new StudentPage(global.driver);
  }, 30000);

  it(
    'debe crear un nuevo estudiante válido',
    async () => {
      console.log('Starting student registration test as admin…');

      // 1) Hacer login como admin
      await loginPage.navigateToLogin();
      console.log('Navigated to login page');

      await loginPage.enterCredentials('admin@nexus.com', 'Admin123');
      console.log('Admin credentials entered');

      await loginPage.submitLogin();
      console.log('Admin login submitted');

      // Esperar a que aparezca '/dashboard' en la URL
      await driver.wait(
        async () => (await driver.getCurrentUrl()).includes('/dashboard'),
        30000,
        'No se redirigió a /dashboard tras login'
      );
      console.log('Admin successfully logged in, current URL:', await driver.getCurrentUrl());

      // 2) Navegar a la página de estudiantes
      await studentPage.navigateToStudents();
      console.log('Navigated to students page');

      // 3) Hacer clic en “Nuevo Estudiante”
      await studentPage.clickNewStudentButton();
      console.log('Clicked "Nuevo Estudiante" button');

      // 4) Llenar el formulario con datos de prueba
      const timestamp = Date.now();
      const testEmail = `estudiante${timestamp}@school.com`;

      await studentPage.enterName('Estudiante Prueba');
      console.log('Name entered');

      await studentPage.enterAge('21');
      console.log('Age entered');

      await studentPage.enterEmail(testEmail);
      console.log('Email entered:', testEmail);

      // Seleccionar género “Male” (puede ser “Female” u “Other”)
      await studentPage.selectGender('Male');
      console.log('Gender selected: Male');

      // Ingresar nick (opcional)
      await studentPage.enterNickname('nickprueba');
      console.log('Nickname entered: nickprueba');

      // 5) Enviar el formulario
      await studentPage.submitForm();
      console.log('Student form submitted');

      // 6) Verificar que el nuevo estudiante aparezca en la tabla (hasta 10s)
      await studentPage.waitForStudentInTable(testEmail);
      console.log('New student found in table:', testEmail);

      console.log('Student registration test completed successfully');
    },
    90000 // 1.5 minutos de timeout para este test
  );
});