/**
 * Collection of random reusable utility functions
 */
module.exports = {
    isOwner: (user, obj, param) => {
        const { id } = (obj ? obj[param] : {});
        return (user && id && id.equals(user._id));
    },

    // return all objects in the given array that are owned by the given user
    filterUserOwned: (user, objs) => {
        return (user ? objs.filter((obj) => { return obj.user && user._id.equals(obj.user._id); }) : []);
    },
}
