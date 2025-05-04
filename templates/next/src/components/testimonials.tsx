"use client"

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/container";

const testimonials = [
  {
    id: 1,
    quote:
      "BrokerBot has transformed the way I manage my office and my agent interactions. It's like having an assistant managing broker that never sleeps!",
    name: "Charlotte Fields",
    title: "Broker/Owner",
    image: "/testimonials/charlotte.avif",
  },
  {
    id: 2,
    quote:
      "I was amazed how quickly BrokerBot learned our team’s policy’s and procedure.  It was like that scene with Neo in the Matrix where he learns Kung FU!",
    name: "Mateo Delgado",
    title: "Team Leader",
    image: "/testimonials/mateo.avif",
  },
  {
    id: 3,
    quote:
      "The ability to instantly have deep insights from our crm data have been a game-changer for our brokerage. BrokerBot truly delivers on its promises.",
    name: "Imani Pierce",
    title: "Team Leader",
    image: "/testimonials/imani.avif",
  },
  {
    id: 4,
    quote:
      "Since implementing BrokerBot, our administrative workload has decreased by 50%, allowing us to focus more on growing our team and retaining agents.",
    name: "Daniel Hastings",
    title: "Associate Broker",
    image: "/testimonials/daniel.avif",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <h2 className="text-3xl font-bold font-serif text-center mb-12">What our clients are saying</h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={slideRef}>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row gap-10 items-stretch h-full">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="rounded h-full w-auto object-cover h-[150px]"
                      />
                      <div>
                        <p className="text-lg mb-4">{testimonial.quote}</p>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute top-1/2 left-0 -translate-y-1/2 translate-x-0 bg-white rounded-full p-2 shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-0 bg-white rounded-full p-2 shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Stats - increased font size and changed to gray */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-5xl font-bold mb-2 text-gray-600 font-mserifono">33+</p>
            <p className="text-gray-600">hours saved per brokerage monthly</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2 text-gray-600 font-serif">83%</p>
            <p className="text-gray-600">of questions answered automatically</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold mb-2 text-gray-600 font-serif">20%</p>
            <p className="text-gray-600">higher client satisfaction</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
