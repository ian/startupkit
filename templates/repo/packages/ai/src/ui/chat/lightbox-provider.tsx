"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { Lightbox } from "./lightbox";

interface LightboxContextType {
	isOpen: boolean;
	currentImageIndex: number;
	images: string[];
	openLightbox: (images: string[], index: number) => void;
	closeLightbox: () => void;
	nextImage: () => void;
	prevImage: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(
	undefined,
);

export const LightboxProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [images, setImages] = useState<string[]>([]);

	const openLightbox = (newImages: string[], index: number) => {
		setImages(newImages);
		setCurrentImageIndex(index);
		setIsOpen(true);
	};

	const closeLightbox = () => {
		setIsOpen(false);
	};

	const nextImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentImageIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length,
		);
	};

	return (
		<LightboxContext.Provider
			value={{
				isOpen,
				currentImageIndex,
				images,
				openLightbox,
				closeLightbox,
				nextImage,
				prevImage,
			}}
		>
			{children}
			<Lightbox />
		</LightboxContext.Provider>
	);
};

export const useLightbox = () => {
	const context = useContext(LightboxContext);
	if (context === undefined) {
		throw new Error("useLightbox must be used within a LightboxProvider");
	}
	return context;
};
