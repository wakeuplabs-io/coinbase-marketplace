export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e2e4e9] mt-auto bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 py-3 sm:py-0 sm:h-14 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <p className="text-[10px] sm:text-xs text-[#4a5568] text-center sm:text-left">
          Powered by Coinbase Payments APIs
        </p>
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
          <a
            href="https://docs.cdp.coinbase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4a5568] hover:text-[#0052ff] transition-colors"
          >
            Developer Docs
          </a>
          <span className="text-[#e2e4e9]">|</span>
          <a
            href="https://www.coinbase.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4a5568] hover:text-[#0052ff] transition-colors"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
