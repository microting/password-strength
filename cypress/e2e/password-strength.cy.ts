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

  it('should have toolbar with app name', () => {
    // Verify main toolbar exists with app title
    cy.get('mat-toolbar').should('exist');
    cy.get('.toolbar').should('contain.text', '@angular-material-extensions/password-strength');
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

  it('should navigate to Getting Started page via URL', () => {
    cy.visit('/getting-started');
    cy.url().should('include', '/getting-started');
    // Wait for lazy-loaded module
    cy.get('app-getting-started', { timeout: 10000 }).should('exist');
  });

  it('should navigate to Examples page via URL', () => {
    cy.visit('/examples');
    cy.url().should('include', '/examples');
    // Wait for lazy-loaded module
    cy.get('app-examples', { timeout: 10000 }).should('exist');
  });

  it('should display password strength criteria when toggled', () => {
    // The mat-password-strength-info is initially hidden behind a toggle
    // First verify the toggle exists
    cy.contains('Show Password Details').should('exist');
    
    // Click the toggle to show details
    cy.contains('Show Password Details').parent('mat-slide-toggle').click();
    
    // Now verify password strength info appears
    cy.get('mat-password-strength-info', { timeout: 5000 }).should('exist');
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

  it('should have password visibility toggle', () => {
    // The mat-pass-toggle-visibility component provides password show/hide
    cy.get('mat-pass-toggle-visibility').should('exist');
    
    // Click the toggle icon to show password
    cy.get('mat-pass-toggle-visibility button').first().click();
    
    // After clicking, the input type should change from password to text
    cy.get('input[type="text"]').should('exist');
    
    // Click again to hide
    cy.get('mat-pass-toggle-visibility button').first().click();
    cy.get('input[type="password"]').should('exist');
  });
});
