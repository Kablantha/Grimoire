type PlaceholderPageProps = {
  title: string;
  description: string;
  primary?: boolean;
};

export default function PlaceholderPage({
  title,
  description,
  primary = false,
}: PlaceholderPageProps) {
  return (
    <section aria-labelledby="page-title">
      <p className="mb-3 text-sm font-semibold text-[var(--accent)]">
        {primary ? "Your day" : "Energy Planner"}
      </p>
      <h1
        className={`font-semibold leading-tight tracking-normal text-[var(--ink)] ${
          primary ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}
        id="page-title"
      >
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
        {description}
      </p>
    </section>
  );
}