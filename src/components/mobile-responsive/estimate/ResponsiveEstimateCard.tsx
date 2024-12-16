import ConvertTo from "@/app/estimate/ConvertTo";
import { InvoiceData } from "@/app/estimate/Table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useActionStoreCreateEdit } from "@/stores/createEditStore";
import moment from "moment";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { CiEdit } from "react-icons/ci";

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

type TProps = {
  invoiceEstimate: InvoiceData;
  index: number;
};

export default function ResponsiveEstimateCard({
  invoiceEstimate,
  index,
}: TProps) {
  const {
    id,
    clientName,
    vehicle,
    email,
    phone,
    grandTotal,
    createdAt,
    status,
    bgColor,
    textColor,
  } = invoiceEstimate || {};
  const { setActionType } = useActionStoreCreateEdit();
  return (
    <Card className={cn("w-[330px]", index % 2 === 0 ? evenColor : oddColor)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Link
            href={`/estimate/view/${id}`}
            passHref
            className="block w-full text-blue-600"
          >
            {id}
          </Link>
        </CardTitle>
        <CardDescription className="font-bold">
          {moment(createdAt).format("DD.MM.YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/estimate/view/${id}`}>
          <div>
            <p className="line-clamp-1 text-xl font-bold">{clientName}</p>
            <p className="line-clamp-1 text-xl text-blue-600">{vehicle}</p>
          </div>
          <div className="mt-3 flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{email}</p>
              <p className="text-sm text-gray-500">{phone}</p>
            </div>
            <div>
              <p className="text-2xl text-blue-600">${grandTotal}</p>
              <p
                className="rounded-md px-1 text-left"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                {status || ""}
              </p>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          
          <ConvertTo id={id} />
        </Button>
        <Button className="bg-white">
          <Link
            href={`/estimate/edit/${id}`}
            className="text-xl text-blue-600"
            onClick={() => setActionType("edit")}
          >
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
