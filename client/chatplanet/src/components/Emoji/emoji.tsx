import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const emojis: string[] = ['😀', '😂', '😍', '😎', '😭', '🥺', '👍', '🙌', '🎉'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-16 left-4 bg-white shadow-lg rounded-lg p-2">
      <div className="grid grid-cols-4 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-2xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
