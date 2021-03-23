// https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
const getIframeDocument = () =>
  cy.get("#storybook-preview-iframe").its("0.contentDocument").should("exist");

const getIframeBody = () =>
  getIframeDocument().its("body").should("not.be.undefined").then(cy.wrap);

describe('Marks', () => {
    describe('Bold', () => {
        it('should visit markdown editor', () => {
          cy.visit("/");
          cy.get("#markdown-editor").click();
        })

        it('should make paragraph text bold', () => {
          getIframeBody().setSelection("#ap-rich-text-editor > p:nth-child(3)",'This','.');
        })
    })
})