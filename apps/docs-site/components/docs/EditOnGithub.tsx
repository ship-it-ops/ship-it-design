const REPO = 'https://github.com/ship-it-ops/ship-it-design';
const BRANCH = 'main';

export function EditOnGithub({ source }: { source: string }) {
  const href = `${REPO}/edit/${BRANCH}/${source}`;
  return (
    <div className="text-text-muted mt-8 text-[12px]">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="hover:text-text underline-offset-4 hover:underline"
      >
        Edit this page on GitHub →
      </a>
    </div>
  );
}
