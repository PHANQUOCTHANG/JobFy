import { SubscriptionRepository } from "./subscription.repository";
import { CreateSubscriptionPayload, CreatePaymentPayload, PaymentPaginationParams } from "./subscription.type";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/error";
import prisma from "@/lib/prisma";

export class SubscriptionService {
  private repository: SubscriptionRepository;

  constructor() {
    this.repository = new SubscriptionRepository();
  }

  async getPlans() {
    return await this.repository.getPlans();
  }

  async getActiveSubscription(companyId: string, userId: string) {
    const company = await prisma.company.findFirst({
      where: { id: companyId, OR: [{ ownerId: userId }, { members: { some: { userId } } }] }
    });
    if (!company) throw new ForbiddenError("Not authorized to view this company's subscription");

    return await this.repository.getActiveSubscription(companyId);
  }

  async createSubscription(data: CreateSubscriptionPayload, userId: string) {
    const company = await prisma.company.findFirst({
      where: { id: data.companyId, ownerId: userId } // Only owner can subscribe
    });
    if (!company) throw new ForbiddenError("Only company owner can create subscription");

    const plan = await this.repository.getPlanById(data.planId);
    if (!plan || !plan.isActive) throw new NotFoundError("Plan not found or inactive");

    // Check existing active sub
    const existing = await this.repository.getActiveSubscription(data.companyId);
    if (existing) throw new BadRequestError("Company already has an active subscription");

    // Calculate expiry
    const expiresAt = new Date();
    if (data.billingPeriod === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    return await this.repository.createSubscription(data, expiresAt);
  }

  async cancelSubscription(id: string, userId: string) {
    const sub = await prisma.employerSubscription.findUnique({
      where: { id },
      include: { company: true }
    });
    if (!sub) throw new NotFoundError("Subscription not found");
    if (sub.company.ownerId !== userId) throw new ForbiddenError("Only company owner can cancel");
    if (sub.cancelledAt) throw new BadRequestError("Already cancelled");

    return await this.repository.cancelSubscription(id);
  }

  async getPayments(companyId: string, userId: string, params: PaymentPaginationParams) {
    const company = await prisma.company.findFirst({
      where: { id: companyId, ownerId: userId }
    });
    if (!company) throw new ForbiddenError("Only company owner can view payments");

    return await this.repository.getPayments(companyId, params);
  }

  async createPayment(data: CreatePaymentPayload, userId: string) {
    const company = await prisma.company.findFirst({
      where: { id: data.companyId, ownerId: userId }
    });
    if (!company) throw new ForbiddenError("Only company owner can create payment");

    return await this.repository.createPayment({
      ...data,
      amount: BigInt(data.amount)
    });
  }
}
