import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Link, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { type PageProps } from '@/types';

export default function HamburgerMenu() {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="absolute right-4 top-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <HamburgerMenuIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {auth.user?.worker_code === 'J04' && (
                        <>
                            <DropdownMenuItem asChild>
                                <Link href={route('register')}>ユーザー追加</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href={route('logout')} method="post" as="button">
                            ログアウト
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
