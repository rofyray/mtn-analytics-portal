-- CreateTable
CREATE TABLE "DashboardConfig" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardConfig_pkey" PRIMARY KEY ("id")
);
