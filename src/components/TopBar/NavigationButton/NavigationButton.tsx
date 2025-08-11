import { CustomNavigationButton } from './NavigationButton.style';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export interface IProps {
  label: string;
  href: string;
}

export const NavigationButton = ({ label, href }: IProps) => {
  const pathname = usePathname();
  const active = useMemo(() => {
    if (href === '/' && pathname === '/') return true;
    return pathname?.startsWith(href) && href !== '/';
  }, [pathname, href]);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <CustomNavigationButton
        disableRipple
        sx={(theme) => ({
          ...(active && {
            color: theme.palette.primary[300],
            fontWeight: 600,
          }),
          textTransform: 'none',
          '&:hover': { backgroundColor: 'transparent' },
          padding: 0,
          minWidth: 'auto',
        })}
      >
        {label}
      </CustomNavigationButton>
    </Link>
  );
};
