interface SectionHeaderProps {
  title: string;
  action?: string;
}

export function SectionHeader({
  title,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-sans text-[22px] font-semibold leading-tight tracking-[-0.03em] text-coffee-900">
        {title}
      </h2>

      {action && (
        <button
          className="
            text-[14px]
            font-medium
            text-caramel
            transition-colors
            hover:text-coffee-900
          "
        >
          {action}
        </button>
      )}
    </div>
  );
}