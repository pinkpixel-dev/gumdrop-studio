export default function Footer({ darkMode }) {
  return (
    <footer className="mx-auto w-full max-w-[min(100vw-2rem,120rem)] mt-6 text-center text-xs opacity-70">
      Gumdrop Studio — Made with 💗 by Pink Pixel. Go draw some pixelated kittens.{' '}
      <a
        href="https://docs.gumdropstudio.app"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-100"
      >
        Docs
      </a>
    </footer>
  );
}

