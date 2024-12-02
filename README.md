# Stacks Pay

**Stacks Pay** is a proposed payment request standard for the Stacks blockchain. It provides a standardized method for encoding, decoding, and processing payment requests, ensuring interoperability between wallets and applications within the Stacks ecosystem.

## Features

- **Supports Multiple Operations**: `support`, `invoice`, `mint`, and custom operations.
- **Bech32m Encoding**: Ensures compatibility and data integrity, suitable for QR codes and URL sharing.
- **Comprehensive Validation**: Ensures all parameters meet required formats and constraints.
- **Extensible**: Allows for custom operations tailored to specific use cases.

## Installation

```bash
npm install stacks-pay
```

## Usage

### Importing functions

```typescript
import { encodeStacksPayURL, decodeStacksPayURL } from "stacks-pay";
import {
  InvoiceOperation,
  SupportOperation,
  MintOperation,
  CommonParameters,
} from "stacks-pay/dist/types";
```

### Encoding a payment request

#### Invoice Operation

```typescript
import { encodeStacksPayURL, InvoiceOperation } from "stacks-pay";

const invoiceParams: InvoiceOperation = {
  operation: "invoice",
  recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
  token: "STX",
  amount: "1000",
  description: "Payment for services rendered",
  expiresAt: "2024-12-31T23:59:59Z",
};

const encodedURL = encodeStacksPayURL(invoiceParams);
console.log("Encoded Invoice URL:", encodedURL);
```

#### Support Operation

```typescript
import { encodeStacksPayURL, SupportOperation } from "stacks-pay";

const supportParams: SupportOperation = {
  operation: "support",
  recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
  description: "Support for ongoing development",
  memo: "Thank you for your support!",
};

const encodedURL = encodeStacksPayURL(supportParams);
console.log("Encoded Support URL:", encodedURL);
```

#### Mint Operation

```typescript
import { encodeStacksPayURL, MintOperation } from "stacks-pay";

const mintParams: MintOperation = {
  operation: "mint",
  contractName: "my-nft-contract",
  functionName: "mint",
  token: "STX",
  amount: "500",
  recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
  description: "Minting a new NFT",
  expiresAt: "2024-12-31T23:59:59Z",
};

const encodedURL = encodeStacksPayURL(mintParams);
console.log("Encoded Mint URL:", encodedURL);
```

#### Custom Operations

```typescript
import { encodeStacksPayURL, CommonParameters } from "stacks-pay";

const customParams: CommonParameters = {
  operation: "custom-action",
  contractName: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
  funcionName: "public-dao-function",
  memo: "Memo for special action",
  data: "Custom action parameters",
};

const encodedURL = encodeStacksPayURL(customParams);
console.log("Encoded Custom Operation URL:", encodedURL);
```

### Decoding a payment request

```typescript
import { decodeStacksPayURL } from "stacks-pay";

const fullURL =
  "web+stx:stx1wajky2mnw3u8qcte8ghj76twwehkjcm98ahhqetjv96xjmmw845kuan0d93k2fnjv43kjurfv4h8g02n2qe9y4z9xarryv2wxer4zdjzgfd9yd62gar4y46p2sc9gd23xddrjkjgggu5k5jnye6x76m9dc74x4zcyesk6mm4de6r6vfsxqczver9wd3hy6tsw35k7m3a2pshjmt9de6zken0wg4hxetjwe5kxetnyejhsurfwfjhxst585erqv3595cnytfnx92ryve9xdqn2wf9xdqn2w26juk65n";

const decodedParams = decodeStacksPayURL(fullURL);
console.log("Decoded Parameters:", decodedParams);

// output:
// {
//  "operation": "invoice",
//  "recipient": "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
//  "token": "STX",
//  "amount": "1000",
//  "description": "Payment for services rendered",
//  "expiresAt": "2024-12-31T23:59:59Z"
// }
```

### Handling Custom Operations

Custom operations allow you to extend the standard set of operations (`support`, `invoice`, `mint`) with your own defined actions. Here's how to handle them:

#### Encoding Custom Operations

When encoding a custom operation, include any additional parameters relevant to your use case:

```typescript
import { encodeStacksPayURL, CommonParameters } from "stacks-pay";

const customParams: CommonParameters = {
  operation: "custom-action",
  recipient: "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
  memo: "Custom memo for special action",
  data: "Some custom data related to the action",
};

const encodedURL = encodeStacksPayURL(customParams);
console.log("Encoded Custom Operation URL:", encodedURL);
```

#### Decoding Custom Operations

Upon decoding, all custom parameters will be included in the resulting object:

```typescript
import { decodeStacksPayURL } from "stacks-pay";

const fullURL = "web+stx:stx1..."; // Your encoded custom operation URL

const decodedParams = decodeStacksPayURL(fullURL);
console.log("Decoded Custom Operation Parameters:", decodedParams);
// output:
//{
//  "operation": "custom-action",
//  "recipient": "SP2RTE7F21N6GQ6BBZR7JGGRWAT0T5Q3Z9ZHB9KRS",
//  "memo": "Custom memo for special action",
//  "data": "Some custom data related to the action"
//}
```

## API Reference

### `encodeStacksPayURL(params: CommonParameters): string`

**Description:**  
Encodes the provided payment parameters into a Stacks Pay URL using Bech32m encoding.

**Parameters:**

- `params` (`CommonParameters`): An object containing the payment parameters. Must include the `operation` field and any other required fields based on the operation type.

**Returns:**

- `string`: The encoded Stacks Pay URL.

**Throws:**

- Error if required parameters are missing or invalid.

**Example:**

```typescript
const encodedURL = encodeStacksPayURL(invoiceParams);
```

### `decodeStacksPayURL(fullURL: string): CommonParameters`

**Description:**  
Decodes a Stacks Pay URL back into its constituent payment parameters.

**Parameters:**

- `fullURL` (`string`): The complete Stacks Pay URL to decode.

**Returns:**

- `CommonParameters`: An object containing the decoded payment parameters.

**Throws:**

- Error if the URL has an invalid protocol or encoding, or if required parameters are missing/invalid.

**Example:**

```typescript
const decodedParams = decodeStacksPayURL(fullURL);
```

### `CommonParameters` Interface

Defines the structure of payment parameters used in encoding and decoding.

```typescript
export interface CommonParameters {
  operation: OperationType;
  recipient?: string;
  token?: string;
  amount?: string;
  description?: string;
  memo?: string;
  expiresAt?: string;
  invoiceNumber?: string;
  dueDate?: string;
  contractAddress?: string;
  contractName?: string;
  functionName?: string;
  [key: string]: string | undefined; // Allows additional custom parameters
}
```

**Fields:**

- `operation` (`OperationType`): The type of operation (`support`, `invoice`, `mint`, or custom).
- `recipient` (`string`, optional): The recipient's Stacks address.
- `token` (`string`, optional): The token type (e.g., `STX`).
- `amount` (`string`, optional): The amount to be transferred.
- `description` (`string`, optional): A description of the payment.
- `memo` (`string`, optional): An optional memo for the payment.
- `expiresAt` (`string`, optional): Expiration timestamp in ISO format.
- `invoiceNumber` (`string`, optional): Invoice number for tracking.
- `dueDate` (`string`, optional): Due date for the invoice.
- `contractAddress` (`string`, optional): Address of the smart contract (for `mint` operations).
- `contractName` (`string`, optional): Name of the smart contract (for `mint` operations).
- `functionName` (`string`, optional): Function name in the smart contract (for `mint` operations).
- `[key: string]: string | undefined;`  
  Allows inclusion of additional custom parameters for custom operations.

## Testing

Ensure that all functionalities work as expected by running the test suite.

### Run Tests

```bash
npm test
```

### Test Coverage

The package includes basic unit tests covering:

- Encoding and decoding of standard operations (`support`, `invoice`, `mint`).
- Handling of custom operations with arbitrary parameters.
- Validation of required and optional parameters.
- Error handling for invalid inputs and malformed URLs.

## Contributing

Contributions are welcome! Whether it's improving the documentation, fixing bugs, or adding new features, your input is valuable.

### How to Contribute

1. **Fork the Repository**

   Click the "Fork" button at the top right of the repository page to create your own copy.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/your-username/stacks-pay-js.git
   cd stacks-pay-js
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Changes**

   Implement your changes, ensuring that the code adheres to the existing style and passes all tests.

5. **Commit Your Changes**

   ```bash
   git commit -m "Add feature: YourFeatureName"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Open a Pull Request**

   Navigate to the original repository and click "Compare & pull request" to submit your changes for review.

### Guidelines

- **Code Quality**: Ensure your code is clean, well-documented, and follows TypeScript best practices.
- **Testing**: Add tests for new features or bug fixes to maintain high test coverage.
- **Documentation**: Update the README and other documentation as necessary to reflect your changes.

## License

This project is licensed under the [MIT](https://opensource.org/license/mit) license.

## Contact

For any questions, suggestions, or support, please reach out:

- **GitHub Issues**: [stacks-pay-js/issues](https://github.com/dantrevino/stacks-pay-js/issues)

## 📂 Repository

Access the source code and contribute on GitHub:

- **GitHub Repository**: [https://github.com/dantrevino/stacks-pay-js](https://github.com/dantrevino/stacks-pay-js)

## 🔗 Additional Resources

- **Stacks Pay SIP**: [Stacks Pay SIP on GitHub](https://github.com/stacksgov/sips)
- **Bech32m Specification**: [BIP-350](https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki)
- **Stacks Documentation**: [Stacks Docs](https://docs.hiro.so/stacks)
