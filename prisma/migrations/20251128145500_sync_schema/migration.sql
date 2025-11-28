-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('STANDARD', 'TITHE', 'INVESTMENT_TOTAL', 'MISC_TOTAL');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEWER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'FEATURE_REQUEST', 'OTHER');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "public"."CreditBalance" DROP CONSTRAINT "CreditBalance_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StorageObject" DROP CONSTRAINT "StorageObject_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsageHistory" DROP CONSTRAINT "UsageHistory_creditBalanceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsageHistory" DROP CONSTRAINT "UsageHistory_userId_fkey";

-- DropIndex
DROP INDEX "public"."CreditBalance_clerkUserId_idx";

-- DropIndex
DROP INDEX "public"."CreditBalance_creditsRemaining_idx";

-- DropIndex
DROP INDEX "public"."CreditBalance_lastSyncedAt_idx";

-- DropIndex
DROP INDEX "public"."CreditBalance_userId_idx";

-- DropIndex
DROP INDEX "public"."Plan_sortOrder_idx";

-- DropIndex
DROP INDEX "public"."StorageObject_contentType_idx";

-- DropIndex
DROP INDEX "public"."StorageObject_deletedAt_idx";

-- DropIndex
DROP INDEX "public"."StorageObject_name_idx";

-- DropIndex
DROP INDEX "public"."StorageObject_userId_idx";

-- DropIndex
DROP INDEX "public"."SubscriptionEvent_clerkUserId_occurredAt_idx";

-- DropIndex
DROP INDEX "public"."SubscriptionEvent_userId_occurredAt_idx";

-- DropIndex
DROP INDEX "public"."UsageHistory_creditBalanceId_idx";

-- DropIndex
DROP INDEX "public"."UsageHistory_operationType_idx";

-- DropIndex
DROP INDEX "public"."UsageHistory_operationType_timestamp_idx";

-- DropIndex
DROP INDEX "public"."UsageHistory_timestamp_idx";

-- DropIndex
DROP INDEX "public"."UsageHistory_userId_timestamp_idx";

-- AlterTable
ALTER TABLE "CreditBalance" ALTER COLUMN "creditsRemaining" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "credits",
DROP COLUMN "sortOrder",
ADD COLUMN     "maxCollaborators" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "currency" SET DEFAULT 'brl',
ALTER COLUMN "features" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StorageObject" DROP COLUMN "deletedAt",
DROP COLUMN "provider",
DROP COLUMN "userId",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "size" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionEvent" DROP COLUMN "eventType",
DROP COLUMN "metadata",
DROP COLUMN "occurredAt",
DROP COLUMN "planKey",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "planId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UsageHistory" DROP COLUMN "creditBalanceId",
DROP COLUMN "operationType",
DROP COLUMN "timestamp",
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "operation" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTitheEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "planningAlertDays" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."AdminSettings";

-- DropTable
DROP TABLE "public"."Feature";

-- DropEnum
DROP TYPE "public"."OperationType";

-- CreateTable
CREATE TABLE "Month" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isTithePaid" BOOLEAN NOT NULL DEFAULT false,
    "tithePaidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "isTithePaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" "ExpenseType" NOT NULL DEFAULT 'STANDARD',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiscExpense" (
    "id" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dayOfMonth" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiscExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "permission" "Permission" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Month_userId_idx" ON "Month"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Month_userId_month_year_key" ON "Month"("userId", "month", "year");

-- CreateIndex
CREATE INDEX "Income_monthId_idx" ON "Income"("monthId");

-- CreateIndex
CREATE INDEX "Expense_monthId_idx" ON "Expense"("monthId");

-- CreateIndex
CREATE INDEX "Investment_monthId_idx" ON "Investment"("monthId");

-- CreateIndex
CREATE INDEX "MiscExpense_monthId_idx" ON "MiscExpense"("monthId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_ownerId_email_key" ON "Collaborator"("ownerId", "email");

-- CreateIndex
CREATE INDEX "Plan_clerkId_idx" ON "Plan"("clerkId");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_clerkUserId_idx" ON "SubscriptionEvent"("clerkUserId");

-- CreateIndex
CREATE INDEX "UsageHistory_clerkUserId_idx" ON "UsageHistory"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiscExpense" ADD CONSTRAINT "MiscExpense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditBalance" ADD CONSTRAINT "CreditBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageHistory" ADD CONSTRAINT "UsageHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

