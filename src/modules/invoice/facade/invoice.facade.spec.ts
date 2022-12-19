import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "12345",
  address: new Address(
    "Street",
    "123",
    "456",
    "City",
    "State",
    "12345-678",
  ),
  items: [
    new Product({
      id: new Id("1"),
      name: "Product 1",
      price: 10,
    }),
    new Product({
      id: new Id("2"),
      name: "Product 2",
      price: 20,
    }),
  ]
});

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should find invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input = {
      id: invoice.id.id,
    };

    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zip_code: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total,
      },
      {
        include: [{ model: ProductModel }],
      }
    );

    const result = await facade.find(input);

    expect(invoice.id.id).toEqual(result.id);
    expect(invoice.name).toEqual(result.name);
    expect(invoice.document).toEqual(result.document);
    expect(invoice.address.street).toEqual(result.address.street);
    expect(invoice.address.number).toEqual(result.address.number);
    expect(invoice.address.complement).toEqual(result.address.complement);
    expect(invoice.address.city).toEqual(result.address.city);
    expect(invoice.address.state).toEqual(result.address.state);
    expect(invoice.address.zipCode).toEqual(result.address.zipCode);
    expect(invoice.items[0].id.id).toEqual(result.items[0].id);
    expect(invoice.items[0].name).toEqual(result.items[0].name);
    expect(invoice.items[0].price).toEqual(result.items[0].price);
    expect(invoice.items[1].id.id).toEqual(result.items[1].id);
    expect(invoice.items[1].name).toEqual(result.items[1].name);
    expect(invoice.items[1].price).toEqual(result.items[1].price);
    expect(invoice.total).toEqual(result.total);
  });

  it("Should generate invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input = {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      total: invoice.total,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
    };

    const output = await facade.generate(input);
    const result = await InvoiceModel.findOne({
      where: { id: output.id },
      include: [{ model: ProductModel }],
    });

    expect(result.id).toBeDefined();
    expect(invoice.name).toEqual(result.name);
    expect(invoice.document).toEqual(result.document);
    expect(invoice.address.street).toEqual(result.street);
    expect(invoice.address.number).toEqual(result.number);
    expect(invoice.address.complement).toEqual(result.complement);
    expect(invoice.address.city).toEqual(result.city);
    expect(invoice.address.state).toEqual(result.state);
    expect(invoice.address.zipCode).toEqual(result.zip_code);
    expect(invoice.items[0].id.id).toEqual(result.items[0].id);
    expect(invoice.items[0].name).toEqual(result.items[0].name);
    expect(invoice.items[0].price).toEqual(result.items[0].price);
    expect(invoice.items[1].id.id).toEqual(result.items[1].id);
    expect(invoice.items[1].name).toEqual(result.items[1].name);
    expect(invoice.items[1].price).toEqual(result.items[1].price);
    expect(invoice.total).toEqual(result.total);
  });

});