import Title from "@/components/Title";
import { Metadata } from "next";
import React from "react";
import Details from "./Details";
import List from "./List";
import MessageBox from "./MessageBox";

export const metadata: Metadata = {
  title: "Communication Hub - Client",
};

// TODO: handle `id` not found
export default function Page({ params }: { params: { id: number } }) {
  return (
    <div>
      <Title>Communication Hub - Client</Title>

      <div className="mt-5 flex justify-around">
        <List id={params.id} />
        <MessageBox id={params.id} />
        <Details id={params.id} />
      </div>
    </div>
  );
}
