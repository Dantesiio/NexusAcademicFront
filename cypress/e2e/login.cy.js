describe('Login', () => {
  it('permite iniciar sesión con credenciales válidas', () => {
    cy.visit('http://localhost:3001/auth/login');
    cy.get('input[name="email"]').type('admin@nexusacademic.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard/main');
  });
}); 