const tagModel = require('../db/tagModel');
const { error, success } = require('../utils/handler');
const mockTags = [];

const createTag = async (req, res) => {
    try {
        const { userId, tagName, color } = req.body;

        if (!userId || !tagName) {
            return res.send(error(401, "User ID and Tag Name are required"));
        }

        if (useMock) {
            const existing = mockTags.find(t => t.userId === userId && t.tagName === tagName);
            if (existing) return res.send(error(401, "Tag already exists for this user"));
            const newTag = { _id: Date.now().toString(36), userId, tagName, color: color || '#3B82F6', createdAt: new Date() };
            mockTags.push(newTag);
            return res.send(success(200, newTag));
        }

        const newTag = await tagModel.create({
            userId,
            tagName,
            color: color || '#3B82F6'
        });

        return res.send(success(200, newTag));
    } catch (e) {
        if (e.code === 11000) {
            return res.send(error(401, "Tag already exists for this user"));
        }
        return res.send(error(401, e.message));
    }
};

const getTags = async (req, res) => {
    try {
        const { userId } = req.body;

        if (useMock) {
            const tags = mockTags.filter(t => t.userId === userId);
            tags.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.send(success(200, tags));
        }

        const tags = await tagModel.find({ userId }).sort({ createdAt: -1 });
        return res.send(success(200, tags));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

const updateTag = async (req, res) => {
    try {
        const { tagId, tagName, color } = req.body;

        if (useMock) {
            const idx = mockTags.findIndex(t => t._id === tagId);
            if (idx === -1) return res.send(error(401, "Tag not found"));
            mockTags[idx] = { ...mockTags[idx], tagName, color };
            return res.send(success(200, mockTags[idx]));
        }

        const updatedTag = await tagModel.findByIdAndUpdate(
            tagId,
            { tagName, color },
            { new: true }
        );

        return res.send(success(200, updatedTag));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

const deleteTag = async (req, res) => {
    try {
        const { tagId } = req.body;

        if (useMock) {
            const idx = mockTags.findIndex(t => t._id === tagId);
            if (idx === -1) return res.send(error(401, "Tag not found"));
            mockTags.splice(idx, 1);
            return res.send(success(200, { response: 'Tag deleted successfully' }));
        }

        await tagModel.findByIdAndDelete(tagId);
        return res.send(success(200, { response: 'Tag deleted successfully' }));
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

module.exports = {
    createTag,
    getTags,
    updateTag,
    deleteTag
};
