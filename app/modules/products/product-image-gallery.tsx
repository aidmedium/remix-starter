import { HttpTypes } from "@medusajs/types";

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[];
};

export const ProductImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex flex-1 flex-col gap-y-4 sm:mx-16">
      {images.map((image, index) => {
        return (
          <div key={image.id} id={image.id}>
            {!!image.url && (
              <img
                src={image.url}
                className="aspect-[4/5] max-h-[60vh] w-full rounded-md lg:max-h-max"
                alt={`Product ${index + 1}`}
                // sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
