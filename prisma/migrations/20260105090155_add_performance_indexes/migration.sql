-- CreateIndex
CREATE INDEX "Request_assignedToId_idx" ON "Request"("assignedToId");

-- CreateIndex
CREATE INDEX "Request_email_idx" ON "Request"("email");

-- CreateIndex
CREATE INDEX "Request_completed_idx" ON "Request"("completed");
