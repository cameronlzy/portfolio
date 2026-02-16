import "@fontsource/press-start-2p/index.css"

const Tag = ({ text }: { text: string }) => {
  // Hash function to pick a consistent green shade based on text length
  // to keep the monochrome aesthetic but add variety.
  const isLight = text.length % 2 === 0

  return (
    <span
      className={`
        font-['Press_Start_2P'] text-[10px] uppercase tracking-widest
        px-2 py-1 border-2 border-gray-900
        ${isLight ? "bg-emerald-100 text-emerald-900" : "bg-emerald-200 text-emerald-950"}
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        transition-transform hover:-translate-y-0.5
      `}
    >
      {text}
    </span>
  )
}

export default Tag
