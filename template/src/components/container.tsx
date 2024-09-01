import clsx from "clsx";

export const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "w-full md:max-w-3xl mx-auto lg:max-w-4xl xl:max-w-7xl px-5 lg:px-0",
        className
      )}
    >
      {children}
    </div>
  );
};
