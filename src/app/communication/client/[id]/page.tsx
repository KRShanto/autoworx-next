import Title from "@/components/Title";
import React from "react";
import List from "./List";
import MessageBox from "./MessageBox";
import Details from "./Details";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communication Hub - Client",
};

// TODO: handle `id` not found
export default function Page({ params }: { params: { id: number } }) {
  return (
    <div>
      <Title>Communication Hub - Client</Title>

      <div className="mt-5 flex gap-5">
        <List id={params.id} />
        <MessageBox id={params.id} />
        <Details id={params.id} />
      </div>
    </div>
  );
}
