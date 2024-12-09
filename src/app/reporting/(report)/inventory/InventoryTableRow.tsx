import { cn } from "@/lib/cn";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import React from "react";

type TProps = {
  productInfo: Prisma.InventoryProductGetPayload<{
    include: {
      InventoryProductHistory: {
        where: {
          type: "Sale";
        };
      };
    };
  }>;
  index: number;
};

export default function InventoryTableRow({ productInfo, index }: TProps) {
  const { averageSales, quantitySold } =
    productInfo &&
    productInfo.InventoryProductHistory.reduce(
      (acc, cur) => {
        const totalSaleProductPrice =
          acc.averageSales + Number(cur.price) * cur.quantity;
        acc.averageSales = totalSaleProductPrice / cur.quantity;
        acc.quantitySold += cur.quantity;
        return acc;
      },
      {
        averageSales: 0,
        quantitySold: 0,
      },
    );
  const averageCost =
    productInfo &&
    Math.round(
      (Number(productInfo?.price) * Number(productInfo?.quantity)) /
        Number(productInfo?.quantity),
    );
  const ReturnAndInvestment =
    averageSales > averageCost
      ? (((averageSales - averageCost) / averageCost) * 100).toFixed(2)
      : 0;
  let redirectUrl = "";
  if (productInfo.type === "Product") {
    redirectUrl = `/inventory?view=products&productId=${productInfo.id}`;
  } else if (productInfo.type === "Supply") {
    redirectUrl = `/inventory?view=supplies&productId=${productInfo.id}`;
  }
  return (
    <tr
      key={productInfo.id}
      className={cn(
        "cursor-pointer rounded-md py-3",
        index % 2 === 0 ? "bg-white" : "bg-blue-100",
      )}
    >
      <td className="border-b px-4 py-2 text-center">
        <Link className="text-blue-500" href={redirectUrl}>
          {productInfo.id}
        </Link>
      </td>
      <td className="border-b px-4 py-2 text-center">{productInfo.name}</td>
      <td className="border-b px-4 py-2 text-center">{averageCost}</td>
      <td className="border-b px-4 py-2 text-center">
        {averageSales.toFixed()}
      </td>
      <td className="border-b px-4 py-2 text-center">{productInfo.quantity}</td>
      <td className="border-b px-4 py-2 text-center">{quantitySold}</td>
      <td className="border-b px-4 py-2 text-center">{productInfo.type}</td>
      <td className="border-b px-4 py-2 text-center">{ReturnAndInvestment}%</td>
    </tr>
  );
}
