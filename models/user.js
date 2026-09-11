const mongoose = require("mongoose");
const Order = require("./order");
const Schema= mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:{
        type:String
    },
    resetTokenExpiration:{
        type:Date
    },
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({productId: product._id, quantity: newQuantity});
    }
    this.cart = {items: updatedCartItems};
    return this.save();
};

userSchema.methods.getCart = function(){
    return this.populate("cart.items.productId").then((user)=>{
        return user.cart.items
            .filter(item => item.productId)
            .map(item => ({...item.productId._doc, quantity: item.quantity}));
    });
};

userSchema.methods.deleteCartItem = function(productId){
    this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    return this.save();
};

userSchema.methods.addOrder = function(){
    return this.populate("cart.items.productId").then((user)=>{
        const items = user.cart.items
            .filter(item => item.productId)
            .map(item => ({...item.productId._doc, quantity: item.quantity}));
        const order = new Order({
            items: items,
            user: {name: this.name, userId: this._id},
            date: new Date()
        });
        return order.save();
    }).then(()=>{
        this.cart = {items: []};
        return this.save();
    });
};

userSchema.methods.getOrders = function(){
    return Order.find({"user.userId": this._id});
};

module.exports = mongoose.model("User",userSchema);

