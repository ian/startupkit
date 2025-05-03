import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect } from "react";
import { useLightbox } from "./lightbox-provider";

export const Lightbox: React.FC = () => {
	const {
		isOpen,
		currentImageIndex,
		images,
		closeLightbox,
		nextImage,
		prevImage,
	} = useLightbox();

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") closeLightbox();
			if (event.key === "ArrowRight") nextImage();
			if (event.key === "ArrowLeft") prevImage();
		},
		[closeLightbox, nextImage, prevImage],
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}
	}, [isOpen, handleKeyDown]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
				>
					<button
						type="button"
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-white hover:text-gray-300"
						aria-label="Close lightbox"
					>
						<X size={24} />
					</button>
					<button
						type="button"
						onClick={prevImage}
						className="absolute left-4 text-white hover:text-gray-300"
						aria-label="Previous image"
					>
						<ChevronLeft size={24} />
					</button>
					<button
						type="button"
						onClick={nextImage}
						className="absolute right-4 text-white hover:text-gray-300"
						aria-label="Next image"
					>
						<ChevronRight size={24} />
					</button>
					<img
						src={images[currentImageIndex]}
						alt={`Lightbox ${currentImageIndex + 1}`}
						className="max-h-[90vh] max-w-[90vw] object-contain"
					/>
					<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
						{currentImageIndex + 1} / {images.length}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
