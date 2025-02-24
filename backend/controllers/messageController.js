const Message = require("../models/Message");
const User = require("../models/user");

const sendMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;

    try {
        const senderUser = await User.findById(sender);
        const receiverUser = await User.findById(receiver);

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ message: "Sender or receiver not found" });
        }

        const newMessage = await Message.create({
            sender,
            receiver,
            content,
            delivered: false,
        });

        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (err) {
        res.status(500).json({ message: "Error sending message", error: err.message });
    }
};

const fetchMessages = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .sort({ timestamp: 1 })
            .populate("sender", "email")
            .populate("receiver", "email");

        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages", error: err.message });
    }
};

module.exports = { sendMessage, fetchMessages };
