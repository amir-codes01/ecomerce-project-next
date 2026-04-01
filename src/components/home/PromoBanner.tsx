import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="bg-yellow-500 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center text-black">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Get 50% Off on Selected Items
          </h2>
          <p className="mt-2">Limited time offer. Don’t miss out!</p>
        </div>

        <Link
          href="/products"
          className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded-lg"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
