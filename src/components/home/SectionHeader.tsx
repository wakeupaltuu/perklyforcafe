export function SectionHeader({ title, action }: { title: string, action?: string }) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="type-section-title text-ink">
        {title}
      </h3>
      {action && (
        <span className="type-caption text-caramel cursor-pointer hover:underline">
          {action}
        </span>
      )}
    </div>
  );
}
