import prisma from "@/lib/prisma";
import { CreateSubscriptionPayload, CreatePaymentPayload, PaymentPaginationParams } from "./subscription.type";

export class SubscriptionRepository {
  async getPlans() {
    return await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: "asc" }
    });
  }

  async getPlanById(id: number) {
    return await prisma.subscriptionPlan.findUnique({ where: { id } });
  }

  async getActiveSubscription(companyId: string) {
    return await prisma.employerSubscription.findFirst({
      where: { 
        companyId, 
        expiresAt: { gt: new Date() },
        cancelledAt: null
      },
      include: { plan: true },
      orderBy: { expiresAt: "desc" }
    });
  }

  async createSubscription(data: CreateSubscriptionPayload, expiresAt: Date) {
    return await prisma.employerSubscription.create({
      data: {
        companyId: data.companyId,
        planId: data.planId,
        billingPeriod: data.billingPeriod,
        expiresAt
      },
      include: { plan: true }
    });
  }

  async cancelSubscription(id: string) {
    return await prisma.employerSubscription.update({
      where: { id },
      data: { cancelledAt: new Date(), autoRenew: false },
      include: { plan: true }
    });
  }

  async getPayments(companyId: string, params: PaymentPaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.payment.count({ where: { companyId } })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createPayment(data: CreatePaymentPayload) {
    return await prisma.payment.create({
      data: {
        ...data,
        amount: data.amount
      }
    });
  }

  async updatePaymentStatus(id: string, status: any, gatewayResponse?: any) {
    return await prisma.payment.update({
      where: { id },
      data: {
        status,
        gatewayResponse: gatewayResponse || undefined,
        completedAt: status === "completed" ? new Date() : undefined
      }
    });
  }
}
