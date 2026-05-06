import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@ship-it-ui/ui';

export default function Example() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem trailing="⌘N">New workspace</MenubarItem>
          <MenubarItem trailing="⌘O">Open…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem trailing="⌘S">Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem trailing="⌘Z">Undo</MenubarItem>
          <MenubarItem trailing="⇧⌘Z">Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Graph</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reset layout</MenubarItem>
          <MenubarItem>Pin selection</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Compact density</MenubarItem>
          <MenubarItem>Cozy density</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem trailing="⌘/">Keyboard shortcuts</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
