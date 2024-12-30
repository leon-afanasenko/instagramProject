import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profile_image: { type: String, require: true },
  image_url: { type: String, required: true },
  user_name: { type: String, required: true },
  caption: { type: String, default: '' },
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
export default Post;