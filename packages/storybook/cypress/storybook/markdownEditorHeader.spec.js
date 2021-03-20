// https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
const getIframeDocument = () =>
  cy.get("#storybook-preview-iframe").its("0.contentDocument").should("exist");

const getIframeBody = () =>
  getIframeDocument().its("body").should("not.be.undefined").then(cy.wrap);

describe(" Placing cursor in paragraph and changing to header 1, 2, 3", () => {
    it("Change to Header 3", () => {
      cy.visit("/");
      //Finds the paragraph and place cursor
      getIframeBody().find("#ap-rich-text-editor > p:nth-child(2)").click();
      //Find heading dropdown and select heading-3
      getIframeBody().find("#ap-rich-text-editor-toolbar > div.ui.simple.dropdown").click();
      getIframeBody().find("#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(4)").click();
      //checks if para changed to heading-3
      getIframeBody().find("#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code").should('have.css', 'font-size', '16px', 'font-weight', 'bold');
      //undo and check
      getIframeBody().find("#ap-rich-text-editor-toolbar > svg:nth-child(11)").click();
      getIframeBody().find("#ap-rich-text-editor > p:nth-child(2)").should('exist');
      //redo and check
      getIframeBody().find("#ap-rich-text-editor-toolbar > svg:nth-child(12)").click();
      getIframeBody().find("#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code").should('have.css', 'font-size', '16px', 'font-weight', 'bold');
     });

    it("Change to Header 2", () => {
        cy.visit("/");
        //Finds the paragraph and place cursor
        getIframeBody().find("#ap-rich-text-editor > p:nth-child(2)").click();
        //Find heading dropdown and select heading-2
        getIframeBody().find("#ap-rich-text-editor-toolbar > div.ui.simple.dropdown").click();
        getIframeBody().find("#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(3)").click();
        //checks if para changed to heading-2
        getIframeBody().find("#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code").should('have.css', 'font-size', '20px', 'font-weight', 'bold');
        //undo and check
        getIframeBody().find("#ap-rich-text-editor-toolbar > svg:nth-child(11)").click();
        getIframeBody().find("#ap-rich-text-editor > p:nth-child(2)").should('exist');
        //redo and check
        getIframeBody().find("#ap-rich-text-editor-toolbar > svg:nth-child(12)").click();
        getIframeBody().find("#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code").should('have.css', 'font-size', '20px', 'font-weight', 'bold');
    }); 
    
    it("Change to Header 1", () => {
        cy.visit("/");
        //Finds the paragraph and place cursor
        getIframeBody().find("#ap-rich-text-editor > p:nth-child(2)").click();
        getIframeBody().find("#ap-rich-text-editor-toolbar > div.ui.simple.dropdown").click();
        //Find heading dropdown and select heading-1
        getIframeBody().find("#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(2)").click();
        //checks if para changed to heading-1
        getIframeBody().find("#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code").should('have.css', 'font-size', '25px', 'font-weight', 'bold');
        //undo and check
        getIframeBody().find("#ap-rich-text-editor-toolbar > svg:nth-child(11)").click();
        getIframeBody().find("#ap-rich-text-editor > p:nth-child(2)").should('exist');
        //redo and check
        getIframeBody().find("#ap-rich-text-editor-toolbar > svg:nth-child(12)").click();
        getIframeBody().find("#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code").should('have.css', 'font-size', '25px', 'font-weight', 'bold');
    });
});