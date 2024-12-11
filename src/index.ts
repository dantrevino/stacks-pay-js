// src/index.ts

import {
  CommonParameters,
  OperationParameters,
  SupportOperation,
  InvoiceOperation,
  MintOperation,
} from "./types";
import {
  validateStacksAddress,
  isValidToken,
  isValidAmount,
  isValidISODate,
  bech32mEncode,
  bech32mDecode,
} from "./utils";

// Operation parameters configuration
const operationParameters: { [key: string]: OperationParameters } = {
  support: {
    required: ["operation", "recipient"],
    optional: ["token", "description", "expiresAt", "memo"],
    ignore: [
      "amount",
      "contractName",
      "dueDate",
      "functionName",
      "invoiceNumber",
    ],
  },
  invoice: {
    required: ["operation", "recipient", "token", "amount"],
    optional: ["description", "expiresAt", "invoiceNumber", "dueDate", "memo"],
    ignore: ["contractName", "functionName"],
  },
  mint: {
    required: ["operation", "contractName", "functionName", "token", "amount"],
    optional: [
      "recipient",
      "description",
      "expiresAt",
      "invoiceNumber",
      "memo",
    ],
    ignore: ["dueDate"],
  },
};

// Validate parameters based on operation
function validateParameters(params: CommonParameters): void {
  const opType = params.operation;
  const opConfig = operationParameters[opType];

  if (!opConfig) {
    if (!params.operation.startsWith("custom-")) {
      throw new Error("Unknown operation type");
    }
    // For custom operations, no specific validation is enforced
    return;
  }

  // Validate required parameters
  for (const param of opConfig.required) {
    if (
      !(param in params) ||
      params[param as keyof CommonParameters] === undefined
    ) {
      throw new Error(
        `Parameter '${param}' is required for operation '${opType}'`
      );
    }
  }

  // Validate and sanitize parameters
  for (const key in params) {
    const value = params[key as keyof CommonParameters];
    if (value === undefined || value === "") continue;

    if (opConfig.ignore.includes(key)) {
      // Ignore this parameter
      delete params[key as keyof CommonParameters];
    } else if (![...opConfig.required, ...opConfig.optional].includes(key)) {
      throw new Error(
        `Parameter '${key}' is not allowed for operation '${opType}'`
      );
    } else {
      // Validate individual parameters
      switch (key) {
        case "recipient":
          if (!validateStacksAddress(value)) {
            throw new Error("Invalid Stacks address for recipient");
          }
          break;
        case "token":
          if (!isValidToken(value)) {
            throw new Error("Invalid token format");
          }
          break;
        case "amount":
          if (!isValidAmount(value)) {
            throw new Error("Invalid amount format");
          }
          break;
        case "expiresAt":
        case "dueDate":
          if (!isValidISODate(value)) {
            throw new Error(`Invalid date format for '${key}'`);
          }
          break;
        case "contractName":
          if (opType === "mint" && value.length === 0) {
            throw new Error("Contract name is required for mint operation");
          }
          break;
        case "functionName":
          if (opType === "mint" && value.length === 0) {
            throw new Error("Function name is required for mint operation");
          }
          break;
        // Additional validations can be added here
      }
    }
  }
}

// Encode Stacks Pay URL
export function encodeStacksPayURL(params: CommonParameters): string {
  try {
    // Validate and sanitize parameters
    validateParameters(params);

    const operation = params.operation;

    const queryParams = new URLSearchParams();

    let allowedParams: string[] = [];

    if (operationParameters[operation]) {
      allowedParams = [
        ...operationParameters[operation].required,
        ...operationParameters[operation].optional,
      ];
    } else if (operation.startsWith("custom-")) {
      // For custom operations, include all parameters except 'operation'
      allowedParams = Object.keys(params).filter((k) => k !== "operation");
    } else {
      throw new Error("Unknown operation type");
    }

    for (const key of allowedParams) {
      const value = params[key as keyof CommonParameters];
      if (value !== undefined && value !== "") {
        queryParams.append(key, value);
      }
    }

    const url = `${operation}?${queryParams.toString()}`;

    // Bech32m encode the URL with HRP 'stx'
    const bech32mEncodedURL = bech32mEncode(url);

    return `web+stx:${bech32mEncodedURL}`;
  } catch (error: any) {
    console.error("Error encoding Stacks Pay URL:", error.message);
    throw error;
  }
}

// Decode Stacks Pay URL
export function decodeStacksPayURL(fullURL: string): CommonParameters {
  try {
    if (!fullURL.startsWith("web+stx:")) {
      throw new Error("Invalid protocol in URL");
    }

    const bech32mEncodedURL = fullURL.replace(
      "web+stx:",
      ""
    ) as `${string}1${string}`;

    const url = bech32mDecode(bech32mEncodedURL);

    const questionMarkIndex = url.indexOf("?");

    let operation: string;
    let queryString: string;

    if (questionMarkIndex >= 0) {
      operation = url.substring(0, questionMarkIndex);
      queryString = url.substring(questionMarkIndex + 1);
    } else {
      operation = url;
      queryString = "";
    }

    const queryParams = new URLSearchParams(queryString);

    const queryEntries = Object.fromEntries(queryParams.entries());

    // Construct params with operation included
    const params: CommonParameters = { operation, ...queryEntries };

    // Remove ignored parameters
    const opConfig = operationParameters[operation];
    if (opConfig) {
      for (const param of opConfig.ignore) {
        delete params[param as keyof CommonParameters];
      }
    }

    // Validate parameters after decoding
    validateParameters(params);

    return params;
  } catch (error: any) {
    console.error("Error decoding Stacks Pay URL:", error.message);
    throw error;
  }
}
