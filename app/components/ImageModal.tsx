"use client";

import Image from "next/image";
import Modal from "./Modal";

interface ImageModalProps {
  src?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  if (!src) {
    return null;
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-96 h-80">
          <Image alt="Image" className="object-cover" fill src={src} />
        </div>
      </Modal>
    </div>
  );
};

export default ImageModal;
