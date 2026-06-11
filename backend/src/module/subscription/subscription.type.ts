import { SubscriptionPlan, EmployerSubscription, Payment, Company, PaymentMethod } from "@prisma/client";

export interface ISubscriptionPlan extends SubscriptionPlan {}

export interface IEmployerSubscription extends EmployerSubscription {
  plan?: SubscriptionPlan;
}

export interface IPayment extends Payment {
  subscription?: EmployerSubscription;
}

export type CreateSubscriptionPayload = {
  companyId: string;
  planId: number;
  billingPeriod: string;
};

export type CreatePaymentPayload = {
  companyId: string;
  subscriptionId?: string;
  amount: bigint;
  currency?: string;
  method: PaymentMethod;
};

export interface PaymentPaginationParams {
  page?: number;
  limit?: number;
  companyId?: string;
}
