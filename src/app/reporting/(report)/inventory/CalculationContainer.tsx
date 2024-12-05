import React from "react";
import Calculation from "../../components/Calculation";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";

export default async function CalculationContainer() {
  const companyId = await getCompanyId();

  const suppliesPromise = db.inventoryProduct.findMany({
    where: {
      type: "Supply",
      companyId,
    },
    select: {
      price: true,
      quantity: true,
    },
  });
  const productsPromise = db.inventoryProduct.findMany({
    where: {
      type: "Product",
      companyId,
    },
    select: {
      price: true,
      quantity: true,
    },
  });
  const [totalSupplies, totalProducts] = await Promise.all([
    suppliesPromise,
    productsPromise,
  ]);

  const totalSuppliesPrice = totalSupplies.reduce(
    (acc, supply) => acc + Number(supply.price!) * supply.quantity! || 0,
    0,
  );

  const totalProductPrice = totalProducts.reduce(
    (acc, product) => acc + Number(product.price!) * product?.quantity! || 0,
    0,
  );

  // const totalProductPrice = totalProducts.reduce(
  //   (acc, product) => acc + Number(product.price!) || 0,
  //   0,
  // );

  return (
    <div className="my-7 grid grid-cols-4 gap-4">
      <Calculation content="Total Products" amount={totalProductPrice} />
      <Calculation content="Total Supplies" amount={totalSuppliesPrice} />
    </div>
  );
}
