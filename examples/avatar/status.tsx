import { Avatar, AvatarGroup } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="flex items-center gap-4">
            <Avatar name="Priya" status="ok" />
            <Avatar name="Esme" status="warn" />
            <Avatar name="Mohamed" status="err" />
            <Avatar name="Anya" status="off" />
        </div>
    );
}

