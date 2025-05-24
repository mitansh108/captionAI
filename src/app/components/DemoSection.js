export default function Demosection() {
  return (
    <section className="flex justify-center md:justify-center gap-16 -mt-30">
      {/* Without Captions – hidden on small screens */}
      <div className="hidden md:block bg-gray-600/50 w-[240px] h-[480px] rounded-xl overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="/vids/without-captions.mp4"
          autoPlay
          loop
          playsInline
          muted
        />
      </div>

      {/* With Captions – visible on all screens */}
      <div className="block bg-gray-600/50 w-[240px] h-[480px] rounded-xl overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="/vids/with-captions.mp4"
          autoPlay
          loop
          playsInline
          muted
        />
      </div>
    </section>
  );
}
