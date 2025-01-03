import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
     try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);

     } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal server error"});
     }
};

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId }, { receiverId: userToChatId },
                { senderId: userToChatId }, { receiverId: myId }
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getMessages: ", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id:receiverId } = req.params;
        const { text, message } = req.body;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            // Upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId, 
            receiverId, 
            text, 
            image: imageUrl
        });

        await newMessage.save();

        // todo: realtime message sending ==> socket.io

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};