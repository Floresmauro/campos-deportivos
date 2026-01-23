"use client";

import Image from 'next/image';

interface InstagramImage {
    url: string;
    titulo: string;
    descripcion: string;
}

interface ImageGridProps {
    images: InstagramImage[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
    return (
        <div className="instagram-grid">
            {images.map((img, index) => (
                <div key={index} className="grid-item">
                    <div className="image-wrapper">
                        <img
                            src={img.url}
                            alt={img.titulo}
                            loading="lazy"
                        />
                        <div className="hover-overlay">
                            <div className="overlay-content">
                                <h3>{img.titulo}</h3>
                                <p>{img.descripcion}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <style jsx>{`
                .instagram-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    width: 100%;
                }

                .grid-item {
                    aspect-ratio: 1 / 1;
                    position: relative;
                    overflow: hidden;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-sm);
                    cursor: pointer;
                }

                .image-wrapper {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .hover-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(45, 90, 39, 0.9), rgba(16, 185, 129, 0.4));
                    display: flex;
                    align-items: flex-end;
                    padding: 1.5rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .grid-item:hover img {
                    transform: scale(1.1);
                }

                .grid-item:hover .hover-overlay {
                    opacity: 1;
                }

                .overlay-content h3 {
                    color: white;
                    margin: 0;
                    font-size: 1.2rem;
                    font-family: var(--font-title);
                    transform: translateY(10px);
                    transition: transform 0.3s ease;
                }

                .overlay-content p {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 0.85rem;
                    margin: 0.25rem 0 0;
                    transform: translateY(10px);
                    transition: transform 0.3s ease 0.1s;
                }

                .grid-item:hover h3,
                .grid-item:hover p {
                    transform: translateY(0);
                }

                @media (max-width: 1024px) {
                    .instagram-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }
                }

                @media (max-width: 600px) {
                    .instagram-grid {
                        grid-template-columns: 1fr;
                    }
                    .hover-overlay {
                        opacity: 1;
                        background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
                        padding: 1rem;
                    }
                    .overlay-content h3 { transform: none; font-size: 1rem; }
                    .overlay-content p { display: none; }
                }
            `}</style>
        </div>
    );
};

export default ImageGrid;
