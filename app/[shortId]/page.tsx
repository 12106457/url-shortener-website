import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/app/lib/mongodb";
import { UrlSchema } from "@/app/model/url";
import { ObjectId } from "mongodb";

const Url = mongoose.models.Url || mongoose.model("Url", UrlSchema);

interface Props {
  params: { shortId: string };
}

export default async function RedirectPage({ params }: Props) {
 
  const shortId = params.shortId;

 
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