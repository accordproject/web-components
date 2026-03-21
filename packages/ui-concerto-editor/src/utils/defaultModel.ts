export const defaultCto = `namespace org.example.nda@1.0.0

enum Jurisdiction {
  o California
  o NewYork
  o Delaware
  o Texas
}

concept Address {
  o String street
  o String city
  o String zipCode
  o Jurisdiction jurisdiction
}

abstract concept Person {
  o String name
  o String email optional
}

concept Party extends Person {
  o Address address
  o String[] tags optional
}

concept NdaData {
  o DateTime effectiveDate
  --> Party disclosingParty
  --> Party receivingParty
  o Boolean isMutual
  o Jurisdiction jurisdiction
  o Integer termYears
}

map ContactInfo {
  o String
  o String
}
`;
