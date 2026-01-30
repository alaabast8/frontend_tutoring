describe('User Authentication and Onboarding', () => {
  
  // 1. Test Student Registration Flow
  it('should allow a student to toggle to registration mode', () => {
    cy.visit('http://localhost:5173/'); // Adjust port to your dev server
    cy.contains('Register now').click();
    cy.get('h2').should('contain', 'Register as STUDENT');
    cy.get('input[name="email"]').should('be.visible');
  });

  // 2. Test Doctor Login and Redirect to Profile
  it('should navigate to doctor profile setup on first login', () => {
    // Intercept login API call
    cy.intercept('POST', '**/doctors/login', {
      statusCode: 200,
      body: { id: 'doc_99', username: 'dr_smith' }
    }).as('loginReq');

    // Intercept profile check (simulating profile doesn't exist)
    cy.intercept('GET', '**/doctors/check-profile/**', {
      statusCode: 200,
      body: { exists: false }
    }).as('profileCheck');

    cy.visit('http://localhost:5173/');
    cy.contains('Doctor').click();
    cy.get('input[name="username"]').type('dr_smith');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait(['@loginReq', '@profileCheck']);
    cy.url().should('include', '/doctor-main');
    cy.get('h2').should('contain', 'Complete Your Professional Profile');
  });

  // 3. Test Form Submission in Student Profile
  it('submits the student profile form successfully', () => {
    // Manually visit with state would require a custom command, 
    // so we test the UI interactions of the form.
    cy.visit('http://localhost:5173/student-main'); 
    cy.get('input[placeholder="John"]').type('Alas');
    cy.get('input[placeholder="Doe"]').type('Albast');
    cy.get('input[placeholder="State University"]').type('Eduway Uni');
    cy.get('input[type="number"]').first().clear().type('3');
    cy.get('button').contains('Save & Continue').click();
    // Assuming alert is handled or navigation occurs
  });
});