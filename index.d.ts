declare module "delibee" {
  interface DelibeeOption {
    timeout?: number;
    locale?: string;
  }
  interface DeliveryCompanyType {
    [key: string]: string;
  }
  interface InvoiceHistory {
    dateTime: number;
    dateString: string;
    location: string;
    tel: string;
    remark: string;
    statusCode: number;
    statusText: string;
  }
  interface Invoice {
    deliveryCompany: {
      code: string;
      name: string;
    };
    invoiceNumber: string;
    senderName: string;
    senderAddr: string;
    receiverName: string;
    receiverAddr: string;
    statusCode: number;
    statusText: string;
    history: InvoiceHistory[];
  }
  interface TrackingResult {
    success: boolean;
    invoice?: Invoice;
    message?: string;
  }
  interface Delibee {
    company: () => Promise<DeliveryCompanyType>;
    tracking: (
      companyCode: string,
      invoiceNumber: string
    ) => Promise<TrackingResult>;
  }
  const delibee: (options?: DelibeeOption) => Delibee;
  export = delibee;
}
