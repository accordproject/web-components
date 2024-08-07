export const TestModel = `namespace test 

enum Country {
  o USA
  o UK
  o France
  o Sweden
}

participant Person identified by name {
  o String name
  o Address address
  --> Person[] children optional
}

concept Address {
  o String street
  o String city
  @FormEditor( "hide", true)
  o String zipCode
  o Country country
}
`;
