import Link from "next/link";
import Image from "next/image";

export default function Header({ rightContent, containerClassName = "max-w-6xl", className = "" }) {
  return (
    <header className={`border-b border-gray-200 bg-white ${className}`}>
      <div className={`${containerClassName} mx-auto px-6 lg:px-10 py-4 flex justify-between items-center`}>
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/assets/logo.png" alt="NGOTACK Logo" width={120} height={40} className="h-12 w-auto object-contain" priority />
        </Link>
        {rightContent}
      </div>
    </header>
  );
}
