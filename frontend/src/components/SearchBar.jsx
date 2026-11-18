export default function SearchBar() {
  return (
    <div className="mt-12 flex justify-center">
      <div
        className="
          flex w-full max-w-3xl items-center gap-3
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-purple-500/20
          px-4 py-3
          shadow-[0_0_40px_rgba(168,85,247,0.25)]
        "
      >
        {/* Business input */}
        <input
          type="text"
          placeholder="Business name or keyword"
          className="
            flex-1
            bg-transparent
            px-4 py-2
            text-sm text-white
            placeholder:text-gray-400
            focus:outline-none
          "
        />

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-purple-500/30" />

        {/* Location input */}
        <input
          type="text"
          placeholder="City or zip code"
          className="
            hidden sm:block
            flex-1
            bg-transparent
            px-4 py-2
            text-sm text-white
            placeholder:text-gray-400
            focus:outline-none
          "
        />

        {/* Button */}
        <button
          className="
            rounded-xl
            bg-gradient-to-r from-purple-500 to-violet-600
            px-6 py-2
            text-sm font-semibold text-white
            hover:scale-105
            hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]
            transition
          "
        >
          Search
        </button>
      </div>
    </div>
  );
}
