// cypress/storybook/storybook.spec.ts
/**
 *
 * Storybook Test(s)
 *
 * Storybook is effectively an entirely separate application
 * with its own build configuration. In practice it can break
 * while we're working on our app, updating dependencies, etc.
 *
 * This test aims to catch when it breaks, at least in the most
 * fundamental, easily-detectable ways.
 *
 * (e.g., when the default story can't render)
 */

// https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
const getIframeDocument = () =>
  cy.get("#storybook-preview-iframe").its("0.contentDocument").should("exist");

const getIframeBody = () =>
  getIframeDocument().its("body").should("not.be.undefined").then(cy.wrap);

describe("Storybook", () => {
  it("visits storybook", () => {
    cy.visit("/");

    cy.get("#markdown-editor").click();
    getIframeBody().should("contain.text", "My Heading");
  });
});