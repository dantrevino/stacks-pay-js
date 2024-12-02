// tests/index.test.ts

import { encodeStacksPayURL, decodeStacksPayURL } from "../src/index";
import {
  InvoiceOperation,
  MintOperation,
  SupportOperation,
  CommonParameters,
} from "../src/types";

describe("Stacks Pay Tests", () => {
  test("Encode and Decode Invoice Operation", () => {
    const invoiceParams: InvoiceOperation = {
      operation: "invoice",
      recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
      token: "STX",
      amount: "1000",
      description: "Payment for services",
      expiresAt: "2024-12-31T23:59:59Z",
    };

    const encodedURL = encodeStacksPayURL(invoiceParams);
    const decodedParams = decodeStacksPayURL(encodedURL);

    expect(decodedParams).toEqual(invoiceParams);
  });

  test("Encode and Decode Support Operation", () => {
    const supportParams: SupportOperation = {
      operation: "support",
      recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
      description: "Thank you!",
      memo: "Optional memo",
    };

    const encodedURL = encodeStacksPayURL(supportParams);
    const decodedParams = decodeStacksPayURL(encodedURL);

    expect(decodedParams).toEqual(supportParams);
  });

  test("Encode and Decode Mint Operation", () => {
    const mintParams: MintOperation = {
      operation: "mint",
      contractName: "my-nft-contract",
      functionName: "mint",
      token: "STX",
      amount: "500",
      recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
      description: "Minting an NFT",
      expiresAt: "2024-12-31T23:59:59Z",
    };

    const encodedURL = encodeStacksPayURL(mintParams);
    const decodedParams = decodeStacksPayURL(encodedURL);

    expect(decodedParams).toEqual(mintParams);
  });

  test("Handle Ignored Parameters", () => {
    const invoiceParams: CommonParameters = {
      operation: "invoice",
      recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
      token: "STX",
      amount: "1000",
      description: "Payment for services",
      contractName: "shouldBeIgnored",
      functionName: "shouldBeIgnored",
    };

    const encodedURL = encodeStacksPayURL(invoiceParams);
    const decodedParams = decodeStacksPayURL(encodedURL);

    const expectedParams: InvoiceOperation = {
      operation: "invoice",
      recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
      token: "STX",
      amount: "1000",
      description: "Payment for services",
    };

    expect(decodedParams).toEqual(expectedParams);
  });

  test("Invalid Parameters Should Throw Error", () => {
    const invalidParams: InvoiceOperation = {
      operation: "invoice",
      recipient: "INVALID_ADDRESS",
      token: "STX",
      amount: "1000",
      description: "Payment for services",
    };

    expect(() => encodeStacksPayURL(invalidParams)).toThrow(
      "Invalid Stacks address for recipient"
    );
  });

  test("Custom Operation", () => {
    const customParams: CommonParameters = {
      operation: "custom-action",
      recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
      memo: "Custom memo",
      data: "Some custom data",
    };

    const encodedURL = encodeStacksPayURL(customParams);
    const decodedParams = decodeStacksPayURL(encodedURL);

    expect(decodedParams).toEqual(customParams);
  });

  test("Invalid Protocol in URL Should Throw Error", () => {
    const invalidURL =
      "invalid+stx:stx1wajky2mnw3u8qcte8ghj76twwehkjcm98ahhqetjv96xjmmw845kuan0d93k2fnjv43kjurfv4h8g02n2qe9y4z9xarryv2wxer4zdjzgfd9yd62gar4y46p2sc9gd23xddrjkjgggu5k5jnye6x76m9dc74x4zcyesk6mm4de6r6vfsxqczver9wd3hy6tsw35k7m3a2pshjmt9de6zken0wg4hxetjwe5kxetnyejhsurfwfjhxst585erqv3595cnytfnx92ryve9xdqn2wf9xdqn2w26juk65n";

    expect(() => decodeStacksPayURL(invalidURL)).toThrow(
      "Invalid protocol in URL"
    );
  });

  test("Invalid Bech32m Encoded URL Should Throw Error", () => {
    const invalidBech32mURL =
      "web+btc:stx1wajky2mnw3u8qcte8ghj76twwehkjcm98ahhqetjv96xjmmw845kuan0d93k2fnjv43kjurfv4h8g02n2qe9y4z9xarryv2wxer4zdjzgfd9yd62gar4y46p2sc9gd23xddrjkjgggu5k5jnye6x76m9dc74x4zcyesk6mm4de6r6vfsxqczver9wd3hy6tsw35k7m3a2pshjmt9de6zken0wg4hxetjwe5kxetnyejhsurfwfjhxst585erqv3595cnytfnx92ryve9xdqn2wf9xdqn2w26juk65n";

    expect(() => decodeStacksPayURL(invalidBech32mURL)).toThrow(
      "Invalid protocol in URL"
    );
  });
});
