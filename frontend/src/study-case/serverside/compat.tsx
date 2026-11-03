import type React from 'react';

export const Image: React.FC<{
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
  [key: string]: any;
}> = ({ src, alt = '', width, height, className, priority, ...props }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading={priority ? 'eager' : 'lazy'}
    {...props}
  />
);

export const Link: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}> = ({ href, className, children, ...props }) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);
