//components and elements
const STORYBOOK_IFRAME  = "#storybook-preview-iframe";
const IFRAME_DOCUMENT = "0.contentDocument";
const TEST_PARA = "#ap-rich-text-editor > p:nth-child(2)";
const HEADING_DROPDOWN = "#ap-rich-text-editor-toolbar > div.ui.simple.dropdown";
const HEADING_1_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(2)";
const HEADING_2_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(3)";
const HEADING_3_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(4)";
const TEST_HEADING = "#This-is-text-This-is-italic-text-This-is-bold-text-This-is-a-undefined-This-is-inline-code";
const UNDO_BUTTON = "#ap-rich-text-editor-toolbar > svg:nth-child(11)";
const REDO_BUTTON = "#ap-rich-text-editor-toolbar > svg:nth-child(12)";


const getIframeDocument = () =>
  cy.get(STORYBOOK_IFRAME)
    .its(IFRAME_DOCUMENT)
    .should("exist");

const getIframeBody = () =>
  getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);


describe(" Placing cursor in paragraph and changing to header 1, 2, 3", () => {
    it("Change to Header 3", () => {
      cy.visit("/");
      //Finds the paragraph and place cursor
      getIframeBody().find(TEST_PARA) 
        .click();
      //Find heading dropdown and select heading-3
      getIframeBody().find(HEADING_DROPDOWN)
        .click();
      getIframeBody().find(HEADING_3_SELECTOR)
        .click();
      //checks if para changed to heading-3
      getIframeBody()
        .find(TEST_HEADING)
        .should('have.css', 'font-size', '16px', 'font-weight', 'bold');
      //undo and check
      getIframeBody()
        .find(UNDO_BUTTON)
        .click();

      getIframeBody()
        .find(TEST_PARA)
        .should('have.css', 'font-size', '14px');
      //redo and check
      getIframeBody()
        .find(REDO_BUTTON)
        .click();
      
      getIframeBody().
        find(TEST_HEADING).
        should('have.css', 'font-size', '16px', 'font-weight', 'bold');
     });

    it("Change to Header 2", () => {
        cy.visit("/");
        //Finds the paragraph and place cursor
        getIframeBody()
          .find(TEST_PARA).
          click();
        //Find heading dropdown and select heading-2
        getIframeBody()
          .find(HEADING_DROPDOWN)
          .click();
        getIframeBody()
          .find(HEADING_2_SELECTOR)
          .click();
        //checks if para changed to heading-2
        getIframeBody()
          .find(TEST_HEADING)
          .should('have.css', 'font-size', '20px', 'font-weight', 'bold');
        //undo and check
        getIframeBody()
          .find(UNDO_BUTTON)
          .click();

        getIframeBody()
          .find(TEST_PARA)
          .should('have.css', 'font-size', '14px');
        //redo and check
        getIframeBody()
          .find(REDO_BUTTON)
          .click();

        getIframeBody()
          .find(TEST_HEADING)
          .should('have.css', 'font-size', '20px', 'font-weight', 'bold');
    }); 
    
    it("Change to Header 1", () => {
        cy.visit("/");
        //Finds the paragraph and place cursor
        getIframeBody()
          .find(TEST_PARA)
          .click();

        getIframeBody()
          .find(HEADING_DROPDOWN)
          .click();
        //Find heading dropdown and select heading-1
        getIframeBody()
          .find(HEADING_1_SELECTOR)
          .click();
        //checks if para changed to heading-1
        getIframeBody()
          .find(TEST_HEADING)
          .should('have.css', 'font-size', '25px', 'font-weight', 'bold');
        //undo and check
        getIframeBody()
          .find(UNDO_BUTTON)
          .click();

        getIframeBody()
          .find(TEST_PARA)
          .should('have.css', 'font-size', '14px');
        //redo and check
        getIframeBody()
          .find(REDO_BUTTON)
          .click();

        getIframeBody()
          .find(TEST_HEADING)
          .should('have.css', 'font-size', '25px', 'font-weight', 'bold');
    });
});