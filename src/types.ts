// src/types.ts

export type OperationType = "support" | "invoice" | "mint" | string;

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
  // Allow additional custom parameters
  [key: string]: string | undefined;
}

export interface SupportOperation extends CommonParameters {
  operation: "support";
  recipient: string;
}

export interface InvoiceOperation extends CommonParameters {
  operation: "invoice";
  recipient: string;
  token: string;
  amount: string;
}

export interface MintOperation extends CommonParameters {
  operation: "mint";
  contractName: string;
  functionName: string;
  token: string;
  amount: string;
  recipient?: string;
}

export interface OperationParameters {
  required: string[];
  optional: string[];
  ignore: string[];
}
