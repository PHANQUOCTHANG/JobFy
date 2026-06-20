import { ISubscriptionPlan, IEmployerSubscription, IPayment } from "./subscription.type";

export const toPlanResponse = (plan: ISubscriptionPlan) => {
  return {
    id: plan.id,
    type: plan.type,
    name: plan.name,
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    maxJobs: plan.maxJobs,
    maxResumes: plan.maxResumes,
    maxFeatured: plan.maxFeatured,
    canSeeProfile: plan.canSeeProfile,
    hasAnalytics: plan.hasAnalytics,
    features: plan.features,
    isActive: plan.isActive,
  };
};

export const toPlanListResponse = (plans: ISubscriptionPlan[]) => {
  return plans.map(toPlanResponse);
};

export const toSubscriptionResponse = (sub: IEmployerSubscription) => {
  return {
    id: sub.id,
    companyId: sub.companyId,
    planId: sub.planId,
    billingPeriod: sub.billingPeriod,
    startedAt: sub.startedAt,
    expiresAt: sub.expiresAt,
    cancelledAt: sub.cancelledAt,
    autoRenew: sub.autoRenew,
    jobsUsed: sub.jobsUsed,
    resumesViewed: sub.resumesViewed,
    plan: sub.plan ? toPlanResponse(sub.plan) : undefined
  };
};

export const toPaymentResponse = (payment: IPayment) => {
  return {
    id: payment.id,
    subscriptionId: payment.subscriptionId,
    companyId: payment.companyId,
    amount: payment.amount.toString(), // Convert BigInt to string
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    invoiceUrl: payment.invoiceUrl,
    createdAt: payment.createdAt,
    completedAt: payment.completedAt
  };
};

export const toPaymentListResponse = (payments: IPayment[]) => {
  return payments.map(toPaymentResponse);
};
