/**
 * Collection of random reusable utility functions
 */
module.exports = {
    isOwner: (user, obj, param) => {
        const { id } = (obj ? obj[param] : {});
        return (user && id && id.equals(user._id));
    },
}
