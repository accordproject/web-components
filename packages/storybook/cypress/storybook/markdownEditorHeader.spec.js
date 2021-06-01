import {H1_STYLING, H2_STYLING, H3_STYLING, H4_STYLING, H5_STYLING, H6_STYLING} from '@accordproject/ui-markdown-editor/src/utilities/constants';

//components and elements
const STORYBOOK_IFRAME  = "#storybook-preview-iframe";
const IFRAME_DOCUMENT = "0.contentDocument";
const TEST_PARA = "#ap-rich-text-editor > p:nth-child(2)";
const HEADING_DROPDOWN = "#ap-rich-text-editor-toolbar > div.ui.simple.dropdown";
const HEADING_1_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(2)";
const HEADING_2_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(3)";
const HEADING_3_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(4)";
const HEADING_4_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(5)";
const HEADING_5_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(6)";
const HEADING_6_SELECTOR = "#ap-rich-text-editor-toolbar > div.ui.active.visible.simple.dropdown > div.menu.transition.visible > div:nth-child(7)";
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


describe(" Placing cursor in paragraph and changing to headers", () => {
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
          .should('have.css', H1_STYLING);
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
          .should('have.css', H1_STYLING);
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
          .should('have.css', H2_STYLING);
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
          .should('have.css', H2_STYLING);
    }); 

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
        .should('have.css', H3_STYLING);
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
        should('have.css', H3_STYLING);
     });

    it("Change to Header 4", () => {
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
        .find(HEADING_4_SELECTOR)
        .click();
      //checks if para changed to heading-1
      getIframeBody()
        .find(TEST_HEADING)
        .should('have.css', H4_STYLING);
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
        .should('have.css', H4_STYLING);
  });

  it("Change to Header 5", () => {
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
        .find(HEADING_5_SELECTOR)
        .click();
      //checks if para changed to heading-1
      getIframeBody()
        .find(TEST_HEADING)
        .should('have.css', H5_STYLING);
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
        .should('have.css', H5_STYLING);
  });

  it("Change to Header 6", () => {
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
        .find(HEADING_6_SELECTOR)
        .click({force: true}); //cypress suggested to use this as the center of the element was hidden from view
      //checks if para changed to heading-1
      getIframeBody()
        .find(TEST_HEADING)
        .should('have.css', H6_STYLING);
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
        .should('have.css', H6_STYLING);
  });
});