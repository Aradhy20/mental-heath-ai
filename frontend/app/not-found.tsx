import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-foreground">
            <div className="text-center">
                <h2 className="text-4xl font-bold">404</h2>
                <p className="text-xl font-semibold">Not Found</p>
                <p className="mt-2 text-muted-foreground">Could not find request resource</p>
            </div>
            <Link href="/">
                <Button variant="default">Return Home</Button>
            </Link>
        </div>
    );
}
