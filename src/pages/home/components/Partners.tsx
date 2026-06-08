import SectionHeader from "./SectionHeader";

import fooladMobarake1 from "@/assets/images/partners/foolad_mobarake 1.png";
import iranKhodro1 from "@/assets/images/partners/iran_khodro 1.png";
import saipa1 from "@/assets/images/partners/saipa 1.png";
import zobAhan1 from "@/assets/images/partners/Esfahan-Steel-Compony-Logo-450x450.png";

const companyLogos = [
  { src: fooladMobarake1, alt: "Foolad mobarake" },
  { src: iranKhodro1, alt: "Iran khodro" },
  { src: saipa1, alt: "Saipa" },
  { src: zobAhan1, alt: "Zob ahan" },
];

export default function Partners() {
  return (
    <section className="w-full max-w-[1312px] mx-auto py-10 px-4">
      <SectionHeader
        seeAllLink={true}
        textColor="black"
        title="همکاری با شرکت ها"
        showLink={true}
      />

      {/* Responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center mt-8">
        {companyLogos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="w-32 h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain"
          />
        ))}
      </div>
    </section>
  );
}
