import React from "react";
import Calculation from "../../components/Calculation";
import { db } from "@/lib/db";

export default async function CalculationContainer() {
  const suppliesPromise = db.inventoryProduct.findMany({
    where: {
      type: "Supply",
    },
    select: {
      price: true,
    },
  });
  const productsPromise = db.inventoryProduct.findMany({
    where: {
      type: "Product",
    },
    select: {
      price: true,
    },
  });
  const [totalSupplies, totalProducts] = await Promise.all([
    suppliesPromise,
    productsPromise,
  ]);

  const totalSuppliesPrice = totalSupplies.reduce(
    (acc, supply) => acc + Number(supply.price!),
    0,
  );

  const totalProductPrice = totalProducts.reduce(
    (acc, supply) => acc + Number(supply.price!),
    0,
  );
  return (
    <div className="my-7 grid grid-cols-5 gap-4">
      <Calculation content="Total Products" amount={totalProductPrice} />
      <Calculation content="Total Supplies" amount={totalSuppliesPrice} />
    </div>
  );
}
