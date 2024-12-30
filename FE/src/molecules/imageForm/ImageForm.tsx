import { useState, FormEvent, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import styles from "./ImageForm.module.css";
import { $api } from "../../api/api";
import noPhoto from "../../assets/noPhoto.png";

interface ImageFormProps {
  closeModal: () => void;
}

export const ImageForm: React.FC<ImageFormProps> = ({ closeModal }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState("");
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [statusVisible, setStatusVisible] = useState(false);

  const emojis = Array.from({ length: 50 }, (_, i) =>
    String.fromCodePoint(0x1f600 + i)
  );

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFilePath(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please upload image");
      setStatusVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    if (text.trim()) formData.append("caption", text);

    setIsUploading(true);
    setUploadStatus("Loading...");
    setStatusVisible(true);

    try {
      const response = await $api.post("/post", formData);
      setFilePath(response.data.url);
      setUploadStatus("Posted successfully!");
      setStatusVisible(true);

      setText("");
      setFile(null);
      setFilePath("");
      setIsUploading(false);
      setTimeout(() => {
        closeModal();
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Upload failed.");
      setStatusVisible(true);
      setIsUploading(false);
    }
  };

  const handleEmojiButtonClick = () => {
    setShowEmojis((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          setShowEmojis(false);
        }, 9000);
      }
      return newState;
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {statusVisible && (
        <p
          className={`${styles.statusMessage} ${
            uploadStatus === "Posted successfully!" ? styles.success : ""
          }`}
        >
          {uploadStatus}
        </p>
      )}
      <button type="submit" className={styles.submitButton}>
        Share
      </button>
      <div className={styles.bred}>
        <div className={styles.fileInputContainer}>
          <label htmlFor="fileInput" className={styles.uploadLabel}>
            <img
              src={filePath || "/src/assets/place-create.svg"}
              alt="Uploaded file"
              className={styles.uploadIcon}
            />
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
        </div>

        <div className={styles.box_fil}>
          {currentUser && (
            <div className={styles.header}>
              <span className={styles.placeholderImage}>
                <img
                  src={currentUser.profile_image || noPhoto}
                  alt={currentUser.username}
                  className={styles.avatarImage}
                />
              </span>
              <span className={styles.username}>{currentUser.username}</span>
            </div>
          )}

          <textarea
            placeholder="Describe your post"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className={styles.textArea}
          />

          <div className={styles.emojiDropdown}>
            <button
              type="button"
              className={styles.emojiButton}
              onClick={handleEmojiButtonClick}
            >
              😊
            </button>
            {showEmojis && (
              <div className={styles.emojiList}>
                {emojis.map((emoji, index) => (
                  <span
                    key={index}
                    className={styles.emojiItem}
                    onClick={() => setText((prev) => prev + emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
