export default function Testimonials() {
  const reviews = [
    {
      name: "Ali Khan",
      text: "Amazing quality products and fast delivery!",
    },
    {
      name: "Sara Ahmed",
      text: "Best shopping experience ever. Highly recommended!",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        What Our Customers Say
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="p-6 bg-gray-100 rounded-xl">
            <p className="italic">"{r.text}"</p>
            <h4 className="mt-4 font-semibold">{r.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
