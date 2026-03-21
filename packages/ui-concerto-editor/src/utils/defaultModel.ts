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

concept Party {
  o String name
  o String email optional
  o Address address
}

concept NdaData {
  o DateTime effectiveDate
  o Party disclosingParty
  o Party receivingParty
  o Boolean isMutual
  o Jurisdiction jurisdiction
  o Integer termYears
}
`;
