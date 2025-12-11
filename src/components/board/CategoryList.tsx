type CategoryListProps = {
  categories: string[];
  activeCategory?: string;
};

export function CategoryList({ categories, activeCategory }: CategoryListProps) {
  return (
    <div className="rounded-[16px] border border-gray-200 bg-white p-4">
      <div className="space-y-3 text-sm">
        {categories.map((label) => {
          const isActive = activeCategory === label;
          return (
            <div key={label} className={isActive ? "font-semibold text-primary" : "text-gray-600"}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
