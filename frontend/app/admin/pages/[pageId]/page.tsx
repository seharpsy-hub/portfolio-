import { Suspense } from "react";
import AdminPageSections from "./PageSectionsClient";

export default function Page({ params }: { params: { pageId: string } }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm">Loading…</p>}>
      <AdminPageSections pageId={params.pageId} />
    </Suspense>
  );
}
