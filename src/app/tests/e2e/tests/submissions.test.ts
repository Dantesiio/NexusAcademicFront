import { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { SubmissionsPage } from '../pages/SubmissionsPage';

declare const driver: WebDriver;

describe('Submission Grading Test', () => {
  let loginPage: LoginPage;
  let submissionsPage: SubmissionsPage;

  beforeAll(() => {
    loginPage = new LoginPage(global.driver);
    submissionsPage = new SubmissionsPage(global.driver);
  }, 30000);

  it('debe calificar la primera entrega pendiente', async () => {
    console.log('Starting submission grading test…');

    // 1) Loguearse como admin
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

    // 3) Navegar a la página de entregas
    await submissionsPage.navigateToSubmissions();
    console.log('Navigated to submissions page');

    // 4) Esperar a que cargue el grid de entregas
    await submissionsPage.waitForGrid();
    console.log('Submissions grid is visible');

    // 5) Obtener ID de la primera entrega pendiente
    const firstSubmissionId = await submissionsPage.getFirstSubmissionId();
    console.log('First submission ID:', firstSubmissionId);

    // 6) Hacer clic en “Calificar” de la primera entrega pendiente
    await submissionsPage.clickCalificarForSubmission(firstSubmissionId);
    console.log('Clicked "Calificar" on first pending submission');

    // 7) Ingresar calificación y comentarios en el modal
    const testGrade = '4.5';
    const testComments = 'Buen trabajo';

    await submissionsPage.enterGrade(testGrade);
    console.log('Entered grade:', testGrade);

    await submissionsPage.enterComments(testComments);
    console.log('Entered comments:', testComments);

    // 8) Enviar el formulario de calificación
    await submissionsPage.submitGrade();
    console.log('Submitted grading form');

    // 9) Esperar a que se cierre el modal
    await submissionsPage.waitForModalToClose();
    console.log('Grading modal closed');

    console.log('Submission grading test completed successfully');
  }, 120000); // 2 minutos timeout para este test
});