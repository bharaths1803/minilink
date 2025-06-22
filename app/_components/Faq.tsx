"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "How does MiniLink work?",
    answer:
      "Simply paste your long URL into our input box and click 'Shorten'. We'll generate a compact, shareable link that redirects to your original URL.",
  },
  {
    question: "Are my shortened links permanent?",
    answer:
      "Yes, your shortened links are permanent and will continue to work indefinitely and are always accessible",
  },
  {
    question: "Can I track my link analytics?",
    answer:
      "Absolutely! Create a free account to access detailed analytics including click counts, geographic data, and device information for all your shortened links.",
  },
  {
    question: "Is there a limit to how many links I can shorten?",
    answer: "No there is no such limit",
  },
  {
    question: "Can I customize my shortened URLs?",
    answer:
      "Yes! Registered users can create custom aliases for their shortened URLs, making them more memorable and brand-friendly.",
  },
];

const Faq = () => {
  const [viewAnswerIds, setViewAnswerIds] = useState<number[]>([]);

  const isPartOfViewAnswers = (idx: number) => {
    return viewAnswerIds.includes(idx);
  };

  const handleToggleViewAnswer = (idx: number) => {
    if (isPartOfViewAnswers(idx))
      setViewAnswerIds(viewAnswerIds.filter((id) => id !== idx));
    else setViewAnswerIds([...viewAnswerIds, idx]);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl mb-4 font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-white mb-10">
            {" "}
            Everything you need to know about MiniLink
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isViewingAnswer = isPartOfViewAnswers(idx);
              return (
                <div
                  className="py-4 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white"
                  onClick={() => handleToggleViewAnswer(idx)}
                  key={idx}
                >
                  <div className="px-4 flex justify-between items-center">
                    <h3 className="mb-2 text-lg font-semibold">
                      {faq.question}
                    </h3>
                    {isViewingAnswer ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  {isViewingAnswer && (
                    <p className="px-4 border-t border-white">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
