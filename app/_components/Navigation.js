import { auth } from '@/app/_lib/Auth';
import Image from 'next/image';
import Link from "next/link";

export default async function Navigation() {
  const session = await auth();
  console.log(session);

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link href="/cabins" className="hover:text-accent-400 transition-colors">
            Cabins
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-accent-400 transition-colors">
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ?

            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors relative flex items-center gap-2"
            >
              <div className="relative h-8 w-8">
                <Image
                  src={session.user.image}
                  alt="User image"
                  fill
                  className="rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span>Guest area</span>
            </Link>

            :
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              Guest area
            </Link>}
        </li>
      </ul>
    </nav>
  );
}
