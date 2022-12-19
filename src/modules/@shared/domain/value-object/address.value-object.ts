import ValueObject from "./value-object.interface";

export default class Address implements ValueObject {
  _street: string = "";
  _number: string = "";
  _complement: string = "";
  _city: string = "";
  _state: string = "";
  _zipCode: string = "";

  constructor(
    street: string,
    number: string,
    complement: string,
    city: string,
    state: string,
    zipCode: string,
  ) {
    this._street = street;
    this._number = number;
    this._complement = complement;
    this._city = city;
    this._state = state;
    this._zipCode = zipCode;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string {
    return this._complement;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

}
