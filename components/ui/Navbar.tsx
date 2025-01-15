import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-background shadow-sm">
      <div className="flex-1">LOGO</div>

      <div className="flex-1 flex justify-center">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex-1 flex justify-end items-center space-x-4">
        <Link href="/profile" passHref>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
