export default function(user = {}, action) {
    if(action.type === "storeUser") {
        let newUser = action.user
        return newUser
    }
    else {
        return user;
    }
}