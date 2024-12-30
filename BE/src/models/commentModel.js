import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: {type: String, required: true},
  userAvatar: { type: String, required: true },
  comment_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;