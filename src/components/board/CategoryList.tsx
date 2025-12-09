type Category = {
  label: string;
  active?: boolean;
};

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="rounded-[16px] border border-gray-200 bg-white p-4">
      <div className="space-y-3 text-sm">
        {categories.map((category) => (
          <div
            key={category.label}
            className={category.active ? "font-semibold text-primary" : "text-gray-600"}
          >
            {category.label}
          </div>
        ))}
      </div>
    </div>
  );
}
