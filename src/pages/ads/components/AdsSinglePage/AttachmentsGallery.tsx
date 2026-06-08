import React from "react";
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
      {title}
    </h2>
    {children}
  </div>
); // adjust path to where your Section component is

interface Attachment {
  id: string;
  AdvertisementId: string;
  AdvertisementSegment: number;
  Title?: string;
  Description?: string;
  FilePath: string;
  FileName?: string;
}

interface AttachmentGalleryProps {
  attachments: Attachment[];
}

const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({
  attachments,
}) => {
  if (!attachments || attachments.length === 0) return null;

  const segments = [
    { key: 1, title: "تصاویر آگهی" },
    { key: 2, title: "ویژگی‌های فیزیکی" },
    { key: 3, title: "ویژگی‌های شیمیایی" },
    { key: 4, title: "ویژگی‌های محیطی" },
    { key: 5, title: "فرم ویژه" },
  ];

  return (
    <>
      {segments.map((segment) => {
        const segmentFiles = attachments.filter(
          (file) => file.AdvertisementSegment === segment.key
        );

        if (segmentFiles.length === 0) return null;

        return (
          <Section key={segment.key} title={segment.title}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {segmentFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl bg-white dark:bg-gray-900 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${
                        file.FilePath
                      }`}
                      alt={file.Title || `attachment-${index}`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Overlay Info */}
                  {(file.Title || file.Description) && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white px-4 py-3">
                      {file.Title && (
                        <div className="text-base font-semibold truncate drop-shadow-sm">
                          {file.Title}
                        </div>
                      )}
                      {file.Description && (
                        <div className="text-xs opacity-90 mt-0.5 line-clamp-2">
                          {file.Description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hover Tint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
};

export default AttachmentGallery;
