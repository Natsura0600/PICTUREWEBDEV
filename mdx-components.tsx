import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
  a: ({ href = '', children, ...rest }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
