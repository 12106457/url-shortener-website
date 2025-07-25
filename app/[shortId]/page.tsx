// app/[shortId]/page.tsx

import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/app/lib/mongodb";
import { UrlSchema } from "@/app/model/url";
import { ObjectId } from "mongodb";

const Url = mongoose.models.Url || mongoose.model("Url", UrlSchema);

type PageProps = {
  params: {
    shortId: string;
  };
};

export default async function RedirectPage({ params }: any) {
  const { shortId } = params;

  await connectToDatabase();

  if (!ObjectId.isValid(shortId)) {
    return <h1>Invalid URL</h1>;
  }

  const found = await Url.findById(shortId);

  if (found) {
    redirect(found.originalUrl);
  }

  return <h1>404 | URL Not Found</h1>;
}
