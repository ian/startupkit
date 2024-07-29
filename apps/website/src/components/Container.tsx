export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-4 sm:py-16 lg:px-6">
      {children}
    </div>
  );
};
