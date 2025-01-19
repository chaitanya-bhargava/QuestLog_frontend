"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-background/80">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Quest Log Logo"
            width={400}
            height={150}
            className="w-auto h-24"
          />
        </div>
        <p className="text-2xl text-muted-foreground mb-12">
          Discover, explore, and track your favorite games all in one place.
        </p>
        <Link href="/genres" passHref>
          <Button className="bg-primary hover:bg-primary/90 transition-colors duration-200 text-lg px-8 py-6">
            Explore Games <ChevronRight className="h-6 w-6 ml-3" />
          </Button>
        </Link>
      </div>

      <footer className="p-8 bg-background/90 backdrop-blur-sm border-t border-border/50">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Quest Log. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/chaitanya-bhargava"
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <FaGithub className="h-6 w-6" />
              </Button>
            </Link>

            <Link
              href="https://x.com/cheenudotdev"
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <RiTwitterXLine className="h-6 w-6" />
              </Button>
            </Link>

            <Link
              href="https://linkedin.com/in/chaitanyabhargava"
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <FaLinkedin className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
