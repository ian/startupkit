import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      alt="StartupKit Logo"
      src="/startupkit-light.svg"
      className="w-auto h-8"
      width={363}
      height={100}
    />
  );
};
