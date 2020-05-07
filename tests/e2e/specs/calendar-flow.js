describe("calendar-flow", () => {
  it("should allow the user to reserve an event", () => {
    cy.visit("/");
    cy.get('[data-test="working-hours"]')
      .eq(0)
      .click("top");
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.get("[data-test=user-event]").should("contain", "Moj termin");
  });
  it("should allow the user to delete a created event", () => {
    cy.visit("/");
    cy.get('[data-test="working-hours"]')
      .eq(0)
      .click("top");
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.get("[data-test=user-event]").click();
    cy.get("[data-test=delete-event]").click();
    cy.get("[data-test=user-event]").should("not.exist");
  });
  it("should not allow the user to create two events in one day", () => {
    cy.visit("/");
    cy.get('[data-test="working-hours"]')
      .eq(0)
      .click("top");
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.get('[data-test="working-hours"]')
      .eq(0)
      .click(10, 150);
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.contains("Ne možete zakazati više od jednog termina dnevno!");
  });
  it("should not allow the user to create three events in one week", () => {
    cy.visit("/");
    cy.get('[data-test="working-hours"]')
      .eq(0)
      .click("top");
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.get('[data-test="working-hours"]')
      .eq(1)
      .click("top");
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.get('[data-test="working-hours"]')
      .eq(2)
      .click("top");
    cy.get("[data-test=title]").type("Moj termin");
    cy.get("[data-test=create-button]").click();
    cy.contains("Ne možete zakazati više od dva termina tjedno");
  });
});
