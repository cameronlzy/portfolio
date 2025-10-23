const Tag = ({ text }: { text: string }) => (
  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
    {text}
  </span>
)

export default Tag
