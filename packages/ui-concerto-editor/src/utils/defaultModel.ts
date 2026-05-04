export const defaultCto = `namespace org.example.nda@1.0.0

scalar SSN extends String regex=/\\d{3}-\\d{2}-\\d{4}/
scalar Email extends String default="user@example.com"

enum Jurisdiction {
  o California
  o NewYork
  o Delaware
  o Texas
}

concept Address {
  o String street
  o String city
  o String zipCode length=[1,10]
  o Jurisdiction jurisdiction
}

abstract concept Person identified by personId {
  o String personId
  o String name
  o Email email optional
  o SSN ssn optional
}

concept Party extends Person {
  o Address address
  o String[] tags optional
}

@Important
asset NdaContract identified by contractId {
  o String contractId
  o DateTime effectiveDate
  --> Party disclosingParty
  --> Party receivingParty
  o Boolean isMutual
  o Jurisdiction jurisdiction
  o Integer termYears range=[1,10]
}

event ContractSigned {
  o String contractId
  o DateTime signedDate
}

map ContactInfo {
  o String
  o String
}
`;
