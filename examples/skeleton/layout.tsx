import { Skeleton } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="flex max-w-md flex-col gap-3">
            <Skeleton width="70%" height={14} />
            <Skeleton width="90%" height={10} />
            <Skeleton width="60%" height={10} />
            <div className="mt-2 flex items-center gap-3">
                <Skeleton shape="circle" height={40} />
                <div className="flex flex-1 flex-col gap-2">
                    <Skeleton width="40%" height={12} />
                    <Skeleton width="70%" height={10} />
                </div>
            </div>
            <Skeleton shape="block" height={80} />
        </div>
    );
}

