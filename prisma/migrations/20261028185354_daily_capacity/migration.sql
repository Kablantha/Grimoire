-- CreateTable
CREATE TABLE "daily_capacities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_capacities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_type_capacities" (
    "id" UUID NOT NULL,
    "daily_capacity_id" UUID NOT NULL,
    "energy_type_id" UUID NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "energy_type_capacities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "daily_capacities_user_id_date_idx" ON "daily_capacities"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_capacities_user_id_date_key" ON "daily_capacities"("user_id", "date");

-- CreateIndex
CREATE INDEX "energy_type_capacities_energy_type_id_idx" ON "energy_type_capacities"("energy_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "energy_type_capacities_daily_capacity_id_energy_type_id_key" ON "energy_type_capacities"("daily_capacity_id", "energy_type_id");

-- AddForeignKey
ALTER TABLE "daily_capacities" ADD CONSTRAINT "daily_capacities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_type_capacities" ADD CONSTRAINT "energy_type_capacities_daily_capacity_id_fkey" FOREIGN KEY ("daily_capacity_id") REFERENCES "daily_capacities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_type_capacities" ADD CONSTRAINT "energy_type_capacities_energy_type_id_fkey" FOREIGN KEY ("energy_type_id") REFERENCES "energy_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
