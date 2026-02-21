import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 100"
      width="40"
      height="40"
      aria-label="Well-V Logo"
      {...props}
    >
      <defs>
        <clipPath id="clip-left">
          <path d="M0,-1.5 L110,-1.5 L52.5,52.5 L0,98.5 Z" />
        </clipPath>
        <clipPath id="clip-right">
          <path d="M52.5,52.5 L110,-1.5 L110,98.5 L0,98.5 Z" />
        </clipPath>
      </defs>
      
      <path 
        d="M55 90C28 75 8 55 8 35C8 20 18 10 30 10C38 10 45 13 50 20C52 23 53 25 55 28C57 25 58 23 60 20C65 13 72 10 80 10C92 10 102 20 102 35C102 55 82 75 55 90Z"
        fill="#ffd9e0"
        clipPath="url(#clip-left)"
      />
      <path 
        d="M55 90C28 75 8 55 8 35C8 20 18 10 30 10C38 10 45 13 50 20C52 23 53 25 55 28C57 25 58 23 60 20C65 13 72 10 80 10C92 10 102 20 102 35C102 55 82 75 55 90Z"
        fill="#c5e5f0"
        clipPath="url(#clip-right)"
      />
      
      {/* White star motif on the top-right of the heart */}
      <path 
        d="M72 28 L75 22 L78 28 L84 31 L78 34 L75 40 L72 34 L66 31 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
