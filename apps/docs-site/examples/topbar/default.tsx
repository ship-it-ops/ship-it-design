import { Avatar, IconButton, SearchInput, Topbar } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Topbar
      title="Graph Explorer"
      actions={
        <>
          <SearchInput placeholder="Search…" style={{ width: 280 }} />
          <IconButton variant="ghost" icon="⌕" aria-label="Search" />
          <IconButton variant="ghost" icon="⚙" aria-label="Settings" />
          <Avatar name="Mohamed T" size="sm" />
        </>
      }
    />
  );
}
