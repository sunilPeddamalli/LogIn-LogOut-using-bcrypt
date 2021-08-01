
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'kindly enter your password']
    }
})

userSchema.pre('save', async function (next) {
    // if only password is to be modified
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12);
    next()
});

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    if (foundUser) {
        const isValid = await bcrypt.compare(password, foundUser.password);
        return isValid ? foundUser : false;
    } else {
        return false;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;