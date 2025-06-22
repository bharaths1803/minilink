import Faq from "./_components/Faq";
import UrlInput from "./_components/UrlInput";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 border-b border-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-4 font-bold">
              Shrink. Share. Simplify.{" "}
            </h1>
            <p className="text-white mb-10 max-w-3xl mx-auto text-xl md:text-2xl">
              Transform your long URLs into powerful, trackable short links that
              are perfect for social media, emails, and anywhere you need to
              share.
            </p>
          </div>

          <div className="border border-white p-2 mx-auto max-w-2xl mb-10">
            <UrlInput />
          </div>

          {/* Banner Image */}
          <div className="border-2 border-white relative">
            <img
              src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Banner Image for connecting all links"
              className="w-full h-64 md:h-96 grayscale object-cover"
            />
            <div className="absolute inset-0 bg-black/70 flex justify-center items-center">
              <div className="text-center">
                <h2 className="mb-4 font-bold text-3xl md:text-5xl">
                  Connecting the world, one link at a time
                </h2>
                <p className="text-xl">
                  Join the users who trust MiniLink for their URL shortening
                  needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
