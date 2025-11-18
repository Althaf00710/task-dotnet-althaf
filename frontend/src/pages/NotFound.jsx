export default function NotFound() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-violet-700 to-violet-900 overflow-hidden flex items-center justify-center">
      <div className="absolute w-full h-[300px] -translate-y-1/2 top-1/2 ml-0 flex flex-col items-center justify-center gap-6">
        <h1 className="text-[120px] md:text-[150px] text-white font-light lato left-move">
          Oops
        </h1>

        <p className="text-[20px] md:text-[24px] tracking-[4px] text-[#9294AE] font-light right-move lato">
          The page you're looking for isn't here.
        </p>
      </div>
    </div>
  );
}
