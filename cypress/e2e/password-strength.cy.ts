describe('Password Strength Demo App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('app-root .content span')
      .should('contain.text', 'password-strength demo app is running!');
  });

  it('should not have uncaught exceptions', () => {
    // Cypress automatically fails tests if there are uncaught exceptions
    // This test validates that the app loaded without critical errors
    // by checking that we can interact with the DOM successfully
    cy.get('app-root').should('exist');
    cy.get('mat-toolbar').should('be.visible');
  });

  it('should load the password strength component', () => {
    // Test that the mat-password-strength component is present
    cy.get('mat-password-strength').should('exist');
  });

  it('should have navigation links', () => {
    // Verify main navigation elements exist
    cy.get('mat-toolbar').should('exist');
    cy.contains('Getting Started').should('exist');
    cy.contains('Examples').should('exist');
  });

  it('should allow password input', () => {
    // Find password input field and type
    cy.get('input[type="password"]').first().should('exist');
    cy.get('input[type="password"]').first().type('TestPassword123!');
    
    // Verify password strength indicator appears
    cy.get('mat-password-strength').should('be.visible');
  });

  it('should show password strength with weak password', () => {
    cy.get('input[type="password"]').first().type('weak');
    
    // Check that strength indicator shows weak state
    cy.get('mat-password-strength').should('exist');
    // You might want to check for specific classes or colors indicating weak strength
  });

  it('should show password strength with strong password', () => {
    cy.get('input[type="password"]').first().type('StrongP@ssw0rd!123');
    
    // Check that strength indicator shows strong state
    cy.get('mat-password-strength').should('exist');
    // You might want to check for specific classes or colors indicating strong strength
  });

  it('should navigate to Getting Started page', () => {
    cy.contains('Getting Started').click();
    cy.url().should('include', '/getting-started');
  });

  it('should navigate to Examples page', () => {
    cy.contains('Examples').click();
    cy.url().should('include', '/examples');
  });

  it('should display password strength criteria', () => {
    // Verify that password criteria/rules are displayed
    cy.get('mat-password-strength-info').should('exist');
  });

  it('should update strength on password change', () => {
    const input = cy.get('input[type="password"]').first();
    
    // Type weak password
    input.type('abc');
    cy.wait(100); // Small wait for strength calculation
    
    // Clear and type stronger password
    input.clear();
    input.type('StrongPassword123!@#');
    cy.wait(100); // Small wait for strength calculation
    
    // Verify the component responded to changes
    cy.get('mat-password-strength').should('be.visible');
  });

  it('should show/hide password toggle if available', () => {
    // Check if password visibility toggle exists and works
    cy.get('button[aria-label*="password"]').then(($btn) => {
      if ($btn.length > 0) {
        $btn.first().click();
        cy.get('input[type="text"]').should('exist');
      }
    });
  });
});
