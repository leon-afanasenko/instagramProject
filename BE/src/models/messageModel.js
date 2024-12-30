import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;