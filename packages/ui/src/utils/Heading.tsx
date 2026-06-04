import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type Ref } from 'react';

/**
 * Six valid HTML heading levels. Components in the design system expose this
 * type through a `titleAs?: HeadingLevel` prop so consumers can compose the
 * page's H1/H2/H3 hierarchy correctly.
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends ComponentPropsWithoutRef<'h2'> {
  /** Heading level to render. Default `'h2'`. */
  as?: HeadingLevel;
}

/**
 * Renders an `<h1>`–`<h6>` element based on the `as` prop, defaulting to
 * `<h2>`. Use this in design-system components that surface a `titleAs`
 * configurable heading prop so the visual style stays consistent while the
 * underlying element changes.
 *
 * @example
 * <Heading as={titleAs} className="text-[18px] font-semibold">
 *   {title}
 * </Heading>
 */
export const Heading = forwardRef(function Heading(
  { as: Tag = 'h2', ...rest }: HeadingProps,
  ref: Ref<HTMLHeadingElement>,
) {
  const Component = Tag as ElementType;
  return <Component ref={ref} {...rest} />;
});

Heading.displayName = 'Heading';
