import React from "react";
import styles from "./customModal.module.css";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  modalSize: "default" | "left" | "large" | "small";
}

const CustomModal: React.FC<CustomModalProps> = (props) => {
  const { isOpen, onClose, content, modalSize } = props;

  if (!isOpen) return null;

  const getModalClass = () => {
    switch (modalSize) {
      case "large":
        return styles.ModalLarge;
      case "small":
        return styles.ModalSmall;
      case "left":
        return styles.ModalLeft;
      default:
        return styles.ModalDefault;
    }
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div
        className={`${styles.Modal} ${getModalClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalCloseButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.ModalContent}>{content}</div>
      </div>
    </div>
  );
};

export default CustomModal;
