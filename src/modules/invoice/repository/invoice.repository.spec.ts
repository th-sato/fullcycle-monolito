import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import ProductModel from "./product.model";

const invoiceProps = {
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
};

describe("InvoiceRepository test", () => {
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
    const props = invoiceProps;
    const total = invoiceProps.items.reduce((acc, item) => acc + item.price, 0);
    const repository = new InvoiceRepository();

    await InvoiceModel.create(
      {
        id: props.id.id,
        name: props.name,
        document: props.document,
        street: props.address.street,
        number: props.address.number,
        complement: props.address.complement,
        city: props.address.city,
        state: props.address.state,
        zip_code: props.address.zipCode,
        items: props.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: total,
      },
      {
        include: [{ model: ProductModel }],
      }
    );

    const result = await repository.find(props.id.id);

    expect(props.id.id).toEqual(result.id.id);
    expect(props.name).toEqual(result.name);
    expect(props.document).toEqual(result.document);
    expect(props.address.street).toEqual(result.address.street);
    expect(props.address.number).toEqual(result.address.number);
    expect(props.address.complement).toEqual(result.address.complement);
    expect(props.address.city).toEqual(result.address.city);
    expect(props.address.state).toEqual(result.address.state);
    expect(props.address.zipCode).toEqual(result.address.zipCode);
    expect(props.items[0].id.id).toEqual(result.items[0].id.id);
    expect(props.items[0].name).toEqual(result.items[0].name);
    expect(props.items[0].price).toEqual(result.items[0].price);
    expect(props.items[1].id.id).toEqual(result.items[1].id.id);
    expect(props.items[1].name).toEqual(result.items[1].name);
    expect(props.items[1].price).toEqual(result.items[1].price);
    expect(total).toEqual(result.total);
  });

  it("Should save invoice", async () => {
    const props = invoiceProps;
    const invoice = new Invoice(props);
    const repository = new InvoiceRepository();
    await repository.save(invoice);

    const result = await InvoiceModel.findOne({
      where: { id: props.id.id },
      include: [{ model: ProductModel }],
    });

    expect(props.id.id).toEqual(result.id);
    expect(props.name).toEqual(result.name);
    expect(props.document).toEqual(result.document);
    expect(props.address.street).toEqual(result.street);
    expect(props.address.number).toEqual(result.number);
    expect(props.address.complement).toEqual(result.complement);
    expect(props.address.city).toEqual(result.city);
    expect(props.address.state).toEqual(result.state);
    expect(props.address.zipCode).toEqual(result.zip_code);
    expect(props.items[0].id.id).toEqual(result.items[0].id);
    expect(props.items[0].name).toEqual(result.items[0].name);
    expect(props.items[0].price).toEqual(result.items[0].price);
    expect(props.items[1].id.id).toEqual(result.items[1].id);
    expect(props.items[1].name).toEqual(result.items[1].name);
    expect(props.items[1].price).toEqual(result.items[1].price);
    expect(30).toEqual(result.total);
  });
});
