import { Helmet } from "react-helmet-async";

export default function Products() {
  return (
    <>
      <Helmet title="produtos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <div className="space-y-2.5"></div>
      </div>
    </>
  );
}
