import { INVOICE_COLORS } from "./consts";

export  const defaultSalesColumn=[
  { title: "New Leads", type: "sales",order:0 },
  { title: "Leads Generated", type: "sales",order:1 },
  { title: "Follow-up", type: "sales",order:2  },
  { title: "Estimates Created", type: "sales" ,order:3 },
  { title: "Archived", type: "sales" ,order:4 },
  { title: "Converted", type: "sales" ,order:5 },
];

export  const defaultShopColumn=[
  { title: "Pending", type: "shop",order:0  },
  { title: "Completed", type: "shop" ,order:1 },
  { title: "In Progress", type: "shop" ,order:2 },
  { title: "Re-Dos", type: "shop" ,order:3 },
  { title: "Cancelled", type: "shop",order:4  },
 
];

function createColumnWithColor(){

  const defaultSalesColumnWithColor=defaultSalesColumn.map((column,index)=>({
    ...column,
    ...INVOICE_COLORS[index%INVOICE_COLORS.length],
  }));

  const defaultShopColumnWithColor=defaultShopColumn.map((column,index)=>({

    ...column,
    ...INVOICE_COLORS[index%INVOICE_COLORS.length], 
  }));

return [...defaultSalesColumnWithColor,...defaultShopColumnWithColor]
}

export const defaultColumnWithColor= createColumnWithColor();