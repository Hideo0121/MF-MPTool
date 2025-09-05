import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type User } from '@/types';

// The user object from auth can be a Worker. Let's define a more flexible type.
// We assume the authenticated user will at least have one of these properties.
type AuthUser = User & { worker_code?: string };

export function UserInfo({ user, showEmail = false }: { user: AuthUser; showEmail?: boolean }) {

    const getInitials = (name: string | undefined) => {
        if (!name || name.trim() === '') return 'U'; // Return a default initial
        const parts = name.split(' ');
        return parts[0][0].toUpperCase();
    };

    const displayName = user.name || user.worker_code;
    const displayEmail = user.email || '';

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{displayEmail}</span>}
            </div>
        </>
    );
}