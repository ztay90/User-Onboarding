describe("This is our first test!", () => {
    it("Should return true", () => {
        expect(true).to.equal(true)
    })
})

describe("Testing Inputs", () => {
    beforeEach(function() {
        cy.visit("http://localhost:3000")
    })
    it("Inputs", () => {
        cy.get('input[name="name"]').type("Zachary")
          .should("have.value", "Zachary")
        cy.get('input[name="email"]').type("ztay90@gmail.com")
        .should("have.value", "ztay90@gmail.com")
        cy.get('input[name="password"]').type("password123")
        .should("have.value", "password123")
        cy.get('input[type="checkbox"]').check()
        .should("be.checked")
        cy.get('form').submit()
    })
    it('check validation message on invalid input', () => {
      cy.get('input:invalid').should('have.length', 0)
      cy.get('[name="email"]').type('not_an_email')
      cy.get('input:invalid').should('have.length', 0)
      cy.get('[name="email"]').then(($input) => {
        expect($input[0].validationMessage).to.eq('Must be a valid email address')
      })
    })
})