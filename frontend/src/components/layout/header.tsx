import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="text-lg font-bold">
          🔊 소리 볼륨 조절기
        </Link>
      </div>
    </header>
  );
}
