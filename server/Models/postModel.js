import mongoose from "mongoose";

const postShema = mongoose.Model({
    userId: {type: String, required: true},
    desc: String, 
    likes: [],
    images: String,
},
{
    timestamps: true
});

var PostModel = mongoose.model("Posts", postSchema);
export default PostModel;